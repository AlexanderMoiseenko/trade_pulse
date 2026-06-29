import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { EaseView } from 'react-native-ease';
import { useAppSelector } from '../store/hooks';
import { selectUserName, selectUserBalance } from '../store/selectors/userSelectors';
import { colors, spacing, borderRadius } from '../theme';
import { useGetMarketDataQuery, ASSET_NAMES } from '../store/services/marketApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../helpers/i18n';
import { Sparkbar } from '../components/ui/Sparkbar';

export const FeedScreen = () => {
  const name = useAppSelector(selectUserName);
  const balance = useAppSelector(selectUserBalance);
  const insets = useSafeAreaInsets();
  
  // Local state to toggle pulse animation with react-native-ease
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse(prev => !prev);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subscribe to language state to trigger instant, smooth local re-renders
  useAppSelector(state => state.user.language);

  const { data, isLoading, isError, refetch } = useGetMarketDataQuery();

  const formatPrice = (priceStr: string) => {
    const price = parseFloat(priceStr);
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatPercent = (percentStr: string) => {
    const percent = parseFloat(percentStr);
    return percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg, paddingBottom: spacing.lg }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{t.feed.welcome}</Text>
          <Text style={styles.nameText}>{name || t.feed.trader}</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>{t.feed.balanceLabel}</Text>
          <Text style={styles.balanceValue}>
            ${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      {/* Markets Header */}
      <View style={styles.marketsHeader}>
        <Text style={styles.sectionTitle}>{t.feed.markets}</Text>
        <View style={styles.liveIndicatorContainer}>
          <EaseView
            animate={{ opacity: pulse ? 1 : 0.3 }}
            transition={{ type: 'timing', duration: 1000 }}
            style={styles.liveDot}
          />
          <Text style={styles.liveText}>{t.feed.live}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.accent.green} />
            <Text style={styles.loadingText}>{t.feed.fetching}</Text>
          </View>
        )}

        {isError && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{t.feed.failed}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryButtonText}>{t.feed.retry}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && data && (
          <View style={styles.listContainer}>
            {data.map((item) => {
              const name = ASSET_NAMES[item.symbol] || item.symbol;
              const isPositive = parseFloat(item.priceChangePercent) >= 0;

              return (
                <View key={item.symbol} style={styles.card}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardSymbol}>
                      {item.symbol.replace('USDT', '')}
                      <Text style={styles.cardSymbolSub}> / USDT</Text>
                    </Text>
                    <Text style={styles.cardName}>{name}</Text>
                  </View>

                  <View style={styles.cardCenter} pointerEvents="none">
                    <Sparkbar symbol={item.symbol} isPositive={isPositive} />
                  </View>

                  <View style={styles.cardRight}>
                    <Text style={styles.cardPrice}>{formatPrice(item.lastPrice)}</Text>
                    <View
                      style={[
                        styles.percentBadge,
                        isPositive ? styles.badgePositive : styles.badgeNegative,
                      ]}
                    >
                      <Text
                        style={[
                          styles.percentText,
                          isPositive ? styles.textPositive : styles.textNegative,
                        ]}
                      >
                        {formatPercent(item.priceChangePercent)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text.primary,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.accent.green,
    marginTop: 2,
  },
  marketsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.green,
    marginRight: 4,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accent.green,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.text.secondary,
    fontSize: 14,
  },
  errorText: {
    color: colors.accent.red,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.bg.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
  },
  retryButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 35,
  },
  cardSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  cardSymbolSub: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  cardName: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  cardCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 35,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  percentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
    marginTop: 4,
  },
  badgePositive: {
    backgroundColor: colors.state.selectedBg,
  },
  badgeNegative: {
    backgroundColor: colors.state.negativeBg,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textPositive: {
    color: colors.accent.green,
  },
  textNegative: {
    color: colors.accent.red,
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  resetButtonText: {
    fontSize: 12,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.bg.elevated,
  },
  langButton: {
    paddingVertical: spacing.md,
  },
  footerLinkText: {
    fontSize: 12,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

