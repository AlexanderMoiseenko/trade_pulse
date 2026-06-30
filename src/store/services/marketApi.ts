/**
 * RTK Query service for Binance market data.
 *
 * Two endpoints:
 * 1. getMarketData — REST + WebSocket streaming of tickers (BTC, ETH, SOL, ADA)
 * 2. getHistoricalData — REST klines for the line chart
 *
 * Architecture:
 * - Initial fetch via REST → goes into RTK Query cache
 * - WebSocket connects after the first fetch and patches the cache in real-time
 * - Offline fallback: on REST error → read the last cache from MMKV
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { storage } from '../../storage';
import { setOfflineMode } from '../userSlice';
import {
  type MarketTicker,
  type ChartPoint,
  type KlineRaw,
  type Timeframe,
  TIMEFRAME_CONFIG,
  TRACKED_SYMBOLS,
  BINANCE_WS_URL,
  BINANCE_REST_BASE,
} from './types';

const log = (...args: unknown[]) =>
  __DEV__ && console.log('[marketApi]', ...args);
const logError = (...args: unknown[]) =>
  __DEV__ && console.error('[marketApi]', ...args);

const CACHE_KEY = 'cached_market_rates';
const WS_RECONNECT_MS = 3_000;
const SYMBOLS_QUERY = JSON.stringify(TRACKED_SYMBOLS);

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fetchBaseQuery({ baseUrl: BINANCE_REST_BASE }),

  endpoints: builder => ({
    // ----- 1. Real-time Market Tickers (REST + WebSocket) -----
    getMarketData: builder.query<MarketTicker[], void>({
      async queryFn(_arg, queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery(`ticker/24hr?symbols=${SYMBOLS_QUERY}`);

        // Offline fallback: on network error — return MMKV cache
        if (result.error) {
          try {
            const cached = storage.getString(CACHE_KEY);
            if (cached) {
              queryApi.dispatch(setOfflineMode(true));
              return { data: JSON.parse(cached) as MarketTicker[] };
            }
          } catch (e) {
            logError('Failed to parse offline cache:', e);
          }
          return { error: result.error };
        }

        // Save fresh data to MMKV for offline fallback
        const data = result.data as MarketTicker[];
        try {
          storage.set(CACHE_KEY, JSON.stringify(data));
          queryApi.dispatch(setOfflineMode(false));
        } catch (e) {
          logError('Failed to save cache:', e);
        }

        return { data };
      },

      // WebSocket streaming: patch RTK Query cache in real-time
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch },
      ) {
        let ws: WebSocket | null = null;
        let isClosed = false;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

        const connect = () => {
          if (isClosed) return;

          log('Connecting WebSocket...');
          ws = new WebSocket(BINANCE_WS_URL);

          ws.onopen = () => {
            log('WebSocket connected');
            // Re-sync state on reconnect (WebSocket might have missed ticks)
            dispatch(
              marketApi.endpoints.getMarketData.initiate(undefined, {
                subscribe: false,
                forceRefetch: true,
              }),
            );
          };

          ws.onmessage = ({ data: raw }) => {
            try {
              const { data: ticker } = JSON.parse(raw);
              if (!ticker?.s) return;

              dispatch(setOfflineMode(false));

              updateCachedData(draft => {
                const asset = draft.find(item => item.symbol === ticker.s);
                if (asset) {
                  asset.lastPrice = ticker.c;
                  asset.priceChangePercent = ticker.P;
                  asset.highPrice = ticker.h;
                  asset.lowPrice = ticker.l;
                  asset.volume = ticker.v;
                }
              });
            } catch (err) {
              logError('WS message parse error:', err);
            }
          };

          ws.onerror = err => log('WebSocket error:', err);

          ws.onclose = () => {
            log('WebSocket closed');
            if (!isClosed) {
              reconnectTimer = setTimeout(connect, WS_RECONNECT_MS);
            }
          };
        };

        // Wait for initial REST query, then connect WebSocket
        try {
          await cacheDataLoaded;
        } catch {
          // REST failed (offline start) — still run WS loop
        }
        connect();

        // Cleanup on cache unsubscribe
        await cacheEntryRemoved;
        isClosed = true;
        if (reconnectTimer) clearTimeout(reconnectTimer);
        try {
          const activeWs = ws as WebSocket | null;
          activeWs?.close();
        } catch (e) {
          logError('Failed to close WebSocket:', e);
        }
      },
    }),

    // ----- 2. Historical Klines (for line chart) -----
    getHistoricalData: builder.query<
      ChartPoint[],
      { symbol: string; timeframe: Timeframe }
    >({
      query: ({ symbol, timeframe }) => {
        const config = TIMEFRAME_CONFIG[timeframe];
        return `klines?symbol=${symbol}&interval=${config.interval}&limit=${config.limit}`;
      },

      transformResponse: (response: KlineRaw[], _meta, arg) => {
        const len = response.length;
        if (len === 0) return [];

        const lastIndex = len - 2;
        const step = lastIndex / 3;
        const labelIndices = [
          0,
          Math.round(step),
          Math.round(step * 2),
          lastIndex,
        ];

        return response.map((kline, i): ChartPoint => {
          const timestamp = kline[0]; // openTime
          const closePrice = parseFloat(kline[4]);
          let label = '';

          if (labelIndices.includes(i)) {
            label = formatKlineLabel(new Date(timestamp), arg.timeframe);
          }

          return { value: closePrice, label, timestamp };
        });
      },
    }),
  }),
});

// ---------------------------------------------------------------------------
// Helper: Format X-axis labels for the chart
// ---------------------------------------------------------------------------
const formatKlineLabel = (date: Date, timeframe: Timeframe): string => {
  const pad = (n: number) => String(n).padStart(2, '0');

  switch (timeframe) {
    case '1H':
    case '4H':
    case '1D': {
      return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
    case '1W': {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    }
    case '1M': {
      return `D${pad(date.getDate())}`;
    }
  }
};

// ---------------------------------------------------------------------------
// Exported hooks (auto-generated by RTK Query)
// ---------------------------------------------------------------------------
export const { useGetMarketDataQuery, useGetHistoricalDataQuery } = marketApi;
