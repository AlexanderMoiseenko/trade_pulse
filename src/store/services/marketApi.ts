import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { storage } from '../../storage';
import { setOfflineMode } from '../userSlice';

export interface MarketTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

export const ASSET_NAMES: Record<string, string> = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
  SOLUSDT: 'Solana',
  ADAUSDT: 'Cardano',
};

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.binance.com/api/v3' }),
  endpoints: (builder) => ({
    getMarketData: builder.query<MarketTicker[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery('ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","ADAUSDT"]');
        
        if (result.error) {
          try {
            const cached = storage.getString('cached_market_rates');
            if (cached) {
              const cachedData = JSON.parse(cached) as MarketTicker[];
              _queryApi.dispatch(setOfflineMode(true));
              return { data: cachedData };
            }
          } catch (e) {
            console.error('[marketApi] Failed to parse offline cached rates:', e);
          }
          return { error: result.error };
        }

        const data = result.data as MarketTicker[];
        try {
          storage.set('cached_market_rates', JSON.stringify(data));
          _queryApi.dispatch(setOfflineMode(false));
        } catch (e) {
          console.error('[marketApi] Failed to save rates to cache:', e);
        }

        return { data };
      },
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        let ws: WebSocket | null = null;
        let isClosed = false;
        let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

        const connect = () => {
          if (isClosed) return;

          console.log('[marketApi] Connecting WebSocket...');
          ws = new WebSocket(
            'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/adausdt@ticker'
          );

          ws.onopen = () => {
            console.log('[marketApi] WebSocket connected successfully!');
            // Re-fetch initial rates to sync immediately upon reconnection using standard initiate dispatch
            dispatch(
              marketApi.endpoints.getMarketData.initiate(undefined, {
                subscribe: false,
                forceRefetch: true,
              })
            );
          };

          // parse and stream websocket updates to RTK Query cache
          ws.onmessage = (event) => {
            try {
              const response = JSON.parse(event.data);
              if (response && response.data) {
                const ticker = response.data;
                const symbol = ticker.s; // e.g. BTCUSDT
                const lastPrice = ticker.c; // last price string
                const priceChangePercent = ticker.P; // 24h change percent string

                dispatch(setOfflineMode(false)); // Clear offline state if socket streams data

                updateCachedData((draft) => {
                  const asset = draft.find((item) => item.symbol === symbol);
                  if (asset) {
                    asset.lastPrice = lastPrice;
                    asset.priceChangePercent = priceChangePercent;
                  }
                });
              }
            } catch (err) {
              console.error('[marketApi] Failed to parse WebSocket ticker message:', err);
            }
          };

          ws.onerror = (err) => {
            console.log('[marketApi] WebSocket error:', err);
          };

          ws.onclose = () => {
            console.log('[marketApi] WebSocket connection closed.');
            // Try to reconnect in 3 seconds if connection wasn't closed intentionally
            if (!isClosed) {
              reconnectTimeout = setTimeout(() => {
                connect();
              }, 3000);
            }
          };
        };

        try {
          // wait for the initial query to resolve before patching the cache
          await cacheDataLoaded;
          connect();
        } catch {
          // If query failed (e.g. offline start), still start the WebSocket connection loop
          connect();
        }

        // wait for the cache entry to be removed (unsubscribed) to close the connection
        await cacheEntryRemoved;
        isClosed = true;
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        const activeWs = ws as WebSocket | null;
        if (activeWs) {
          try {
            activeWs.close();
          } catch (e) {
            console.error('[marketApi] Failed to close WebSocket:', e);
          }
        }
      },
    }),
  }),
});

export const { useGetMarketDataQuery } = marketApi;
