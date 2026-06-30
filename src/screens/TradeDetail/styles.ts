import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    height: 56,
  },
  backButton: {
    paddingVertical: spacing.sm,
  },
  backText: {
    color: colors.accent.green,
    fontSize: 14,
    fontWeight: '700',
  },
  titleContainer: {
    alignItems: 'center',
  },
  symbolTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text.primary,
  },
  nameSubTitle: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
    marginTop: 1,
  },
  placeholder: {
    width: 60, // visual balance counter for back button
  },
  scrollBody: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xl,
  },
  livePriceText: {
    fontSize: 32,
    fontWeight: '900',
  },
  priceInfoBlock: {
    height: 52, // Reserved fixed height to fully prevent layout shifts!
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  priceLabelLive: {
    color: colors.text.secondary,
  },
  priceLabelSelected: {
    color: colors.accent.green,
  },
  badge: {
    borderRadius: borderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgePositive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  badgeNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  textPositive: {
    color: colors.accent.green,
  },
  textNegative: {
    color: colors.accent.red,
  },
  chartWrapper: {
    marginVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  chartPlaceholder: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    borderRadius: 18,
    padding: 2,
    marginVertical: spacing.xl,
    position: 'relative',
    width: 304,
    alignSelf: 'center',
  },
  timeframeHighlight: {
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bg.elevated,
    position: 'absolute',
    top: 2,
    left: 2,
    width: 60,
  },
  timeframeButton: {
    height: 28,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timeframeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  timeframeTextActive: {
    color: colors.text.primary,
  },
  statsCard: {
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  statsLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  statsValue: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '700',
  },
  positiveText: {
    color: colors.accent.green,
  },
  negativeText: {
    color: colors.accent.red,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    backgroundColor: colors.bg.primary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  tradeButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  buyButton: {
    backgroundColor: colors.accent.green,
  },
  sellButton: {
    backgroundColor: colors.accent.red,
  },
  tradeButtonText: {
    color: colors.text.dark,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
