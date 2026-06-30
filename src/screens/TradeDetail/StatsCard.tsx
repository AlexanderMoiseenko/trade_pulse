import React from 'react';
import { View, Text } from 'react-native';
import { t } from '../../helpers/i18n';
import { formatPrice } from '../../helpers/formatters';
import { styles } from './styles';

interface StatsCardProps {
  high24h: number;
  low24h: number;
  vol24h: number;
  symbol: string;
}

export const StatsCard = ({
  high24h,
  low24h,
  vol24h,
  symbol,
}: StatsCardProps) => {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statsRow}>
        <Text style={styles.statsLabel}>{t.tradeDetail.high24h}</Text>
        <Text style={[styles.statsValue, styles.positiveText]}>
          {formatPrice(high24h)}
        </Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.statsLabel}>{t.tradeDetail.low24h}</Text>
        <Text style={[styles.statsValue, styles.negativeText]}>
          {formatPrice(low24h)}
        </Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.statsLabel}>{t.tradeDetail.volume24h}</Text>
        <Text style={styles.statsValue}>
          {vol24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
          {symbol.replace('USDT', '')}
        </Text>
      </View>
    </View>
  );
};
