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
    }),
  }),
});

export const { useGetMarketDataQuery } = marketApi;
