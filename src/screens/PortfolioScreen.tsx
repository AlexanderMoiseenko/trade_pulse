import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../store/hooks';
import { selectUserBalance } from '../store/selectors/userSelectors';
import { colors, spacing, borderRadius } from '../theme';
import { t } from '../helpers/i18n';

// Static allocations for the demo portfolio
const ALLOCATIONS = [
  { symbol: 'BTC', name: 'Bitcoin', percentage: 60, color: '#34C759', tokenPrice: 60000 },
  { symbol: 'ETH', name: 'Ethereum', percentage: 30, color: '#5856D6', tokenPrice: 3000 },
  { symbol: 'SOL', name: 'Solana', percentage: 8, color: '#007AFF', tokenPrice: 150 },
  { symbol: 'ADA', name: 'Cardano', percentage: 2, color: '#FF9500', tokenPrice: 0.5 },
];

export const PortfolioScreen = () => {
  const insets = useSafeAreaInsets();
  const balance = useAppSelector(selectUserBalance) || 10000;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.headerTitle}>{t.portfolio.title}</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Total Value Card */}
        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>{t.portfolio.totalValue}</Text>
          <Text style={styles.valueText}>
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Allocation Header */}
        <Text style={styles.sectionTitle}>{t.portfolio.allocation}</Text>

        {/* Multi-colored Allocation Bar */}
        <View style={styles.barContainer}>
          {ALLOCATIONS.map((item) => (
            <View
              key={item.symbol}
              style={[
                styles.barSegment,
                {
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
          ))}
        </View>

        {/* Legend / Asset List */}
        <View style={styles.assetList}>
          {ALLOCATIONS.map((item) => {
            const usdValue = (balance * item.percentage) / 100;
            const tokenAmount = usdValue / item.tokenPrice;

            return (
              <View key={item.symbol} style={styles.assetRow}>
                {/* Left side: color dot, name & symbol */}
                <View style={styles.assetLeft}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <View>
                    <Text style={styles.assetName}>{item.name}</Text>
                    <Text style={styles.assetSub}>{item.symbol} · {item.percentage}%</Text>
                  </View>
                </View>

                {/* Right side: USD value & Token amount */}
                <View style={styles.assetRight}>
                  <Text style={styles.assetValue}>
                    ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={styles.tokenAmount}>
                    {tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {item.symbol}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.xxl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  valueCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    marginBottom: spacing.xxl,
  },
  valueLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  valueText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.accent.green,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  barContainer: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.bg.elevated,
    marginBottom: spacing.xl,
  },
  barSegment: {
    height: '100%',
  },
  assetList: {
    marginBottom: spacing.xxxl,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  assetSub: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  tokenAmount: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
