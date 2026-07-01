import { useState, useRef, useEffect } from 'react';
import { colors } from '../../theme';
import { useGetHistoricalDataQuery } from '../../store/services/marketApi';
import type { Timeframe } from '../../store/services/types';

/**
 * Hook for price text color flashing (green on rise, red on drop)
 */
export const usePriceFlash = (currentPrice: number) => {
  const [priceFlashColor, setPriceFlashColor] = useState<string>(colors.text.primary);
  const prevPriceRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentPrice && prevPriceRef.current !== null) {
      const prevPrice = prevPriceRef.current;
      if (currentPrice > prevPrice) {
        setPriceFlashColor(colors.accent.green);
        const timer = setTimeout(() => setPriceFlashColor(colors.text.primary), 500);
        return () => clearTimeout(timer);
      } else if (currentPrice < prevPrice) {
        setPriceFlashColor(colors.accent.red);
        const timer = setTimeout(() => setPriceFlashColor(colors.text.primary), 500);
        return () => clearTimeout(timer);
      }
    }
    if (currentPrice) {
      prevPriceRef.current = currentPrice;
    }
  }, [currentPrice]);

  return priceFlashColor;
};

/**
 * Hook for loading and managing the chart's historical data state
 */
export const useChartData = (symbol: string, timeframe: Timeframe) => {
  const { currentData, isFetching } = useGetHistoricalDataQuery(
    { symbol, timeframe },
    { pollingInterval: 30000 } // Refresh historical data every 30 seconds
  );

  // We use derived state instead of local state and useEffect.
  // currentData automatically becomes undefined when query arguments (symbol or timeframe) change,
  // preventing chart scale jumps between assets and resolving the infinite loading issue.
  const chartData = currentData || [];

  return { chartData, isFetching };
};
