/**
 * Shared types for market data and charts.
 *
 * Why a separate file: Single Source of Truth for types
 * used in marketApi, ChartContainer, TradeDetail, and FeedScreen.
 */

// ---------------------------------------------------------------------------
// Binance API — Response Types
// ---------------------------------------------------------------------------

/** Ticker from GET /ticker/24hr */
export interface MarketTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}

/**
 * Raw kline (candle) row from GET /klines.
 * Binance returns an array of arrays — each element has a fixed positional structure.
 * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data#klinecandlestick-data
 */
export type KlineRaw = [
  openTime: number, // 0
  open: string, // 1
  high: string, // 2
  low: string, // 3
  close: string, // 4 — we use close price for the chart
  volume: string, // 5
  closeTime: number, // 6
  quoteAssetVolume: string, // 7
  numberOfTrades: number, // 8
  takerBuyBaseVol: string, // 9
  takerBuyQuoteVol: string, // 10
  ignore: string, // 11
];

// ---------------------------------------------------------------------------
// Chart — Point Types
// ---------------------------------------------------------------------------

/** One point on the line chart (after transformResponse) */
export interface ChartPoint {
  value: number;
  label: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Timeframes — Constants and Config
// ---------------------------------------------------------------------------

/** Allowed timeframe values */
export type Timeframe = '1H' | '4H' | '1D' | '1W' | '1M';

/** Full list of timeframes for UI (order matters) */
export const TIMEFRAMES: readonly Timeframe[] = [
  '1H',
  '4H',
  '1D',
  '1W',
  '1M',
] as const;

/** Binance API intervals config for each timeframe */
export const TIMEFRAME_CONFIG: Record<
  Timeframe,
  { interval: string; limit: number }
> = {
  '1H': { interval: '5m', limit: 12 },
  '4H': { interval: '15m', limit: 16 },
  '1D': { interval: '2h', limit: 12 },
  '1W': { interval: '12h', limit: 14 },
  '1M': { interval: '1d', limit: 30 },
};

// ---------------------------------------------------------------------------
// Assets — Names and Mapping
// ---------------------------------------------------------------------------

/** Human-readable crypto asset names */
export const ASSET_NAMES: Record<string, string> = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
  SOLUSDT: 'Solana',
  ADAUSDT: 'Cardano',
};

/** Symbols for multistream subscription */
export const TRACKED_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'SOLUSDT',
  'ADAUSDT',
] as const;

const streams = TRACKED_SYMBOLS.map(s => `${s.toLowerCase()}@ticker`).join('/');
export const BINANCE_WS_URL = `wss://stream.binance.com:9443/stream?streams=${streams}`;
export const BINANCE_REST_BASE = 'https://api.binance.com/api/v3';
