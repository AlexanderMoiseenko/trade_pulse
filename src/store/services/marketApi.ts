import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
      query: () => 'ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","ADAUSDT"]',
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create a websocket connection to Binance public streams
        const ws = new WebSocket(
          'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/adausdt@ticker'
        );

        try {
          // wait for the initial query to resolve before patching the cache
          await cacheDataLoaded;

          // parse and stream websocket updates to RTK Query cache
          ws.onmessage = (event) => {
            try {
              const response = JSON.parse(event.data);
              if (response && response.data) {
                const ticker = response.data;
                const symbol = ticker.s; // e.g. BTCUSDT
                const lastPrice = ticker.c; // last price string
                const priceChangePercent = ticker.P; // 24h change percent string

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
        } catch {
          // if the query failed, no action is needed
        }

        // wait for the cache entry to be removed (unsubscribed) to close the connection
        await cacheEntryRemoved;
        ws.close();
      },
    }),
  }),
});

export const { useGetMarketDataQuery } = marketApi;
