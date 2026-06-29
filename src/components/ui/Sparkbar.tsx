import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

interface SparkbarProps {
  symbol: string;
  isPositive: boolean;
}

const CHART_PROFILES: Record<string, number[]> = {
  BTCUSDT: [8, 12, 10, 16, 14, 22, 18, 24, 20, 26, 22, 28],
  ETHUSDT: [18, 14, 20, 16, 22, 18, 24, 20, 16, 22, 18, 24],
  SOLUSDT: [6, 8, 12, 10, 16, 14, 20, 18, 24, 22, 28, 26],
  ADAUSDT: [22, 20, 18, 16, 14, 16, 18, 20, 22, 20, 18, 22],
};

const DEFAULT_PROFILE = [12, 14, 12, 16, 14, 18, 16, 20, 18, 22, 20, 24];

export const Sparkbar = React.memo(({ symbol, isPositive }: SparkbarProps) => {
  const profile = CHART_PROFILES[symbol] || DEFAULT_PROFILE;
  const color = isPositive ? colors.accent.green : colors.accent.red;

  return (
    <View style={styles.container}>
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
  bar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1.5,
    opacity: 0.85,
  },
});
