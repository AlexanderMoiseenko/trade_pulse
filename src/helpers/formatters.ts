/**
 * Shared formatting functions for prices, percentages, and dates.
 *
 * Why a separate file: DRY — formatPrice was duplicated in FeedScreen and TradeDetailScreen,
 * formatSelectedDate lived in ChartContainer as an unexported helper.
 */

// ---------------------------------------------------------------------------
// Price
// ---------------------------------------------------------------------------

/**
 * Formats a numeric price into a string with a $ symbol.
 * Rule: >= $1000 → 2 decimals, < $1000 → 4 decimals (altcoins).
 */
export const formatPrice = (value: number | string): string => {
  const price = typeof value === 'string' ? parseFloat(value) : value;

  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${price.toFixed(4)}`;
};

// ---------------------------------------------------------------------------
// Price Change Percentage
// ---------------------------------------------------------------------------

/**
 * Formats a price change percentage string with a "+" or "-" prefix.
 * Binance returns percentage as a string → parse and format.
 */
export const formatPercent = (percentStr: string): string => {
  const percent = parseFloat(percentStr);
  return percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`;
};

// ---------------------------------------------------------------------------
// Date/Time for Chart Tooltip
// ---------------------------------------------------------------------------

/** Day name arrays for both languages */
const DAYS_UA = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/**
 * Formats a timestamp into a human-readable date string for the chart tooltip.
 *
 * Logic depends on timeframe:
 * - 1H / 4H → time only (15:30)
 * - 1D / 1M → date + time (28.06 15:30)
 * - 1W → day name + date + time (Mon 28.06 15:30)
 */
export const formatSelectedDate = (
  timestamp: number,
  timeframe: string,
  isUa: boolean,
): string => {
  const date = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (timeframe === '1W') {
    const days = isUa ? DAYS_UA : DAYS_EN;
    const dayName = days[date.getDay()];
    return `${dayName} ${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${timeStr}`;
  }

  if (timeframe === '1M' || timeframe === '1D') {
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${timeStr}`;
  }

  return timeStr;
};
