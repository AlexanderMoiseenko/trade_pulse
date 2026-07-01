import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../store/hooks';
import { selectUserBalance } from '../store/selectors/userSelectors';
import { useGetMarketDataQuery } from '../store/services/marketApi';
import { colors, spacing, borderRadius } from '../theme';
import { t } from '../helpers/i18n';

// Static allocations for the demo portfolio. We use fallbackPrice to calculate
// the fixed token amount for the user's initial demo balance.
const ALLOCATIONS = [
  { symbol: 'BTC', name: 'Bitcoin', initialPercentage: 60, color: '#34C759', fallbackPrice: 60000 },
  { symbol: 'ETH', name: 'Ethereum', initialPercentage: 30, color: '#5856D6', fallbackPrice: 3000 },
  { symbol: 'SOL', name: 'Solana', initialPercentage: 8, color: '#007AFF', fallbackPrice: 150 },
  { symbol: 'ADA', name: 'Cardano', initialPercentage: 2, color: '#FF9500', fallbackPrice: 0.5 },
];

export const PortfolioScreen = () => {
  const insets = useSafeAreaInsets();
  const initialBalance = useAppSelector(selectUserBalance) || 10000;

  // Fetch market data. RTK Query handles offline caching automatically.
  const { data: marketData, isLoading } = useGetMarketDataQuery();

  // Calculate live portfolio values
  const { totalValue, liveAllocations } = useMemo(() => {
    let total = 0;
    const allocations = ALLOCATIONS.map((item) => {
      // Find live price from cache/API or use fallback
      const apiSymbol = `${item.symbol}USDT`;
      const liveAsset = marketData?.find((d) => d.symbol === apiSymbol);
      const currentPrice = liveAsset ? parseFloat(liveAsset.lastPrice) : item.fallbackPrice;

      // The user's fixed amount of tokens based on their initial balance
      const initialUsdValue = (initialBalance * item.initialPercentage) / 100;
      const tokenAmount = initialUsdValue / item.fallbackPrice;

      // Live USD value of this token
      const liveUsdValue = tokenAmount * currentPrice;
      total += liveUsdValue;

      return {
        ...item,
        currentPrice,
        tokenAmount,
        liveUsdValue,
      };
    });

    return { totalValue: total, liveAllocations: allocations };
  }, [marketData, initialBalance]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.headerTitle}>{t.portfolio.title}</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Total Value Card */}
        <View style={styles.valueCard} accessible={true} accessibilityLabel={`Total portfolio value is ${totalValue.toFixed(2)} dollars`}>
          <Text style={styles.valueLabel}>{t.portfolio.totalValue}</Text>
          <View style={styles.valueRow}>
            <Text style={styles.valueText}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            {isLoading && !marketData && (
              <ActivityIndicator size="small" color={colors.accent.green} style={styles.loader} />
            )}
          </View>
        </View>

        {/* Allocation Header */}
        <Text style={styles.sectionTitle}>{t.portfolio.allocation}</Text>

        {/* Multi-colored Allocation Bar */}
        <View style={styles.barContainer} accessible={true} accessibilityLabel="Portfolio allocation bar">
          {liveAllocations.map((item) => {
            const currentPercentage = (item.liveUsdValue / totalValue) * 100 || 0;
            return (
              <View
                key={item.symbol}
                style={[
                  styles.barSegment,
                  {
                    width: `${currentPercentage}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Legend / Asset List */}
        <View style={styles.assetList}>
          {liveAllocations.map((item) => {
            const currentPercentage = (item.liveUsdValue / totalValue) * 100 || 0;
            const a11yLabel = t.a11y.assetCard
              .replace('{{name}}', item.name)
              .replace('{{symbol}}', item.symbol)
              .replace('{{percentage}}', currentPercentage.toFixed(1))
              .replace('{{value}}', item.liveUsdValue.toFixed(2))
              .replace('{{amount}}', item.tokenAmount.toFixed(4));

            return (
              <View 
                key={item.symbol} 
                style={styles.assetRow}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={a11yLabel}
              >
                {/* Left side: color dot, name & symbol */}
                <View style={styles.assetLeft}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <View>
                    <Text style={styles.assetName}>{item.name}</Text>
                    <Text style={styles.assetSub}>
                      {item.symbol} · {currentPercentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>

                {/* Right side: USD value & Token amount */}
                <View style={styles.assetRight}>
                  <Text style={styles.assetValue}>
                    ${item.liveUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={styles.tokenAmount}>
                    {item.tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {item.symbol}
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loader: {
    marginLeft: spacing.sm,
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
