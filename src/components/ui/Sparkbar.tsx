import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { useGetHistoricalDataQuery } from '../../store/services/marketApi';

interface SparkbarProps {
  symbol: string;
  isPositive: boolean;
}

const DEFAULT_PROFILE = [12, 14, 12, 16, 14, 18, 16, 20, 18, 22, 20, 24];
const MIN_HEIGHT = 6;
const MAX_HEIGHT = 28;

export const Sparkbar = React.memo(({ symbol, isPositive }: SparkbarProps) => {
  const { data: historicalData, isLoading } = useGetHistoricalDataQuery({
    symbol,
    timeframe: '1D', // 1D = last 24-hour history containing 12 candles of 2 hours each
  });

  const color = isPositive ? colors.accent.green : colors.accent.red;
  const isSkeleton = isLoading || !historicalData || historicalData.length === 0;

  // Create height profile based on real historical prices
  let profile = DEFAULT_PROFILE;

  if (!isSkeleton) {
    const values = historicalData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    profile = values.map(val => {
      if (range === 0) return (MIN_HEIGHT + MAX_HEIGHT) / 2;
      return MIN_HEIGHT + ((val - min) / range) * (MAX_HEIGHT - MIN_HEIGHT);
    });
  }

  return (
    <View style={[styles.container, isSkeleton && styles.skeleton]}>
      {profile.map((h, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: h,
              backgroundColor: color,
            },
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 30,
    width: 60,
    marginHorizontal: spacing.lg,
  },
  skeleton: {
    opacity: 0.25,
  },
  bar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1.5,
    opacity: 0.85,
  },
});
