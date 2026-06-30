import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '../../theme';
import { t } from '../../helpers/i18n';
import { formatPrice } from '../../helpers/formatters';
import { useAppSelector } from '../../store/hooks';
import { useGetMarketDataQuery } from '../../store/services/marketApi';
import { ASSET_NAMES, type Timeframe } from '../../store/services/types';
import type { RootStackParamList } from '../../navigation';

import { ChartContainer } from '../../components/ChartContainer';
import { AnimatedButton } from '../../components/ui/AnimatedButton';

import { TradeHeader } from './TradeHeader';
import { PriceTicker } from './PriceTicker';
import { TimeframeSelector } from './TimeframeSelector';
import { StatsCard } from './StatsCard';
import { usePriceFlash, useChartData } from './hooks';
import { styles } from './styles';

const screenWidth = Dimensions.get('window').width;

export const TradeDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'TradeDetail'>>();
  const insets = useSafeAreaInsets();

  const { symbol } = route.params || { symbol: 'BTCUSDT' };
  const assetName = ASSET_NAMES[symbol] || symbol;

  const currentLang = useAppSelector(state => state.user.language) || 'en';
  const isUa = currentLang === 'uk';

  // Live market data
  const { data: marketData } = useGetMarketDataQuery();
  const activeAsset = marketData?.find(item => item.symbol === symbol);

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  
  // Custom hooks for logic isolation
  const { chartData } = useChartData(symbol, timeframe);
  
  const currentPrice = activeAsset ? parseFloat(activeAsset.lastPrice) : 0;
  const priceFlashColor = usePriceFlash(currentPrice);

  const isPositive = activeAsset
    ? parseFloat(activeAsset.priceChangePercent) >= 0
    : true;

  // Chart interaction state
  const [isChartActive, setIsChartActive] = useState(false);
  const [scrubbedPrice, setScrubbedPrice] = useState<number | null>(null);
  const [scrubbedTime, setScrubbedTime] = useState<string | null>(null);
  const isScrubbingRef = useRef(false);

  const handleOrder = (type: 'buy' | 'sell') => {
    const title = type === 'buy' ? t.tradeDetail.buy : t.tradeDetail.sell;
    Alert.alert(
      title,
      `${title} ${symbol.replace('USDT', '')} @ ${formatPrice(currentPrice)}`,
    );
  };

  const resetScrubbing = () => {
    isScrubbingRef.current = false;
    setIsChartActive(false);
    setScrubbedPrice(null);
    setScrubbedTime(null);
  };

  // Real stats
  const high24h = activeAsset ? parseFloat(activeAsset.highPrice) : currentPrice;
  const low24h = activeAsset ? parseFloat(activeAsset.lowPrice) : currentPrice;
  const vol24h = activeAsset ? parseFloat(activeAsset.volume) : 0;

  // Patch last point with live price to animate the line dynamically
  const liveChartData = React.useMemo(() => {
    if (chartData.length === 0 || currentPrice === 0) return chartData;
    const updated = [...chartData];
    updated[updated.length - 1] = {
      ...updated[updated.length - 1],
      value: currentPrice,
    };
    return updated;
  }, [chartData, currentPrice]);

  // Y-axis limits
  const chartValues = liveChartData.map(d => d.value);
  const minChartVal = chartValues.length > 0 ? Math.min(...chartValues) : currentPrice || 0;
  const maxChartVal = chartValues.length > 0 ? Math.max(...chartValues) : currentPrice || 100;
  const chartRange = maxChartVal - minChartVal || 1;
  const yAxisOffset = Math.max(0, minChartVal - chartRange * 0.15);
  const maxValue = maxChartVal + chartRange * 0.15;

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + spacing.lg }]}
      onTouchEnd={resetScrubbing}
      onTouchCancel={resetScrubbing}
    >
      <TradeHeader symbol={symbol} assetName={assetName} />

      <ScrollView
        style={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isChartActive} // Lock scroll while scrubbing
        onTouchEnd={resetScrubbing}
        onTouchCancel={resetScrubbing}
      >
        <PriceTicker
          currentPrice={currentPrice}
          scrubbedPrice={scrubbedPrice}
          scrubbedTime={scrubbedTime}
          priceFlashColor={priceFlashColor}
          isPositive={isPositive}
          priceChangePercent={activeAsset?.priceChangePercent || '0'}
        />

        <View
          style={styles.chartWrapper}
          onTouchStart={() => {
            if (liveChartData.length === 0) return;
            isScrubbingRef.current = true;
            setIsChartActive(true);
          }}
          onTouchEnd={resetScrubbing}
          onTouchCancel={resetScrubbing}
        >
          {liveChartData.length === 0 ? (
            <View style={styles.chartPlaceholder}>
              <ActivityIndicator size="small" color={colors.accent.green} />
            </View>
          ) : (
            <ChartContainer
              chartData={liveChartData}
              isPositive={isPositive}
              yAxisOffset={yAxisOffset}
              maxValue={maxValue - yAxisOffset}
              setIsChartActive={setIsChartActive}
              setScrubbedPrice={setScrubbedPrice}
              setScrubbedTime={setScrubbedTime}
              isScrubbingRef={isScrubbingRef}
              isUa={isUa}
              timeframe={timeframe}
            />
          )}
        </View>

        <TimeframeSelector
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          screenWidth={screenWidth}
        />

        <StatsCard
          high24h={high24h}
          low24h={low24h}
          vol24h={vol24h}
          symbol={symbol}
        />
      </ScrollView>

      {/* Footer Trade Actions */}
      <View
        style={[styles.footer, { paddingBottom: insets.bottom || spacing.md }]}
      >
        <AnimatedButton
          title={t.tradeDetail.buy}
          onPress={() => handleOrder('buy')}
          style={[styles.tradeButton, styles.buyButton]}
          textStyle={styles.tradeButtonText}
          accessibilityLabel={`Buy ${symbol.replace('USDT', '')} at ${formatPrice(currentPrice)}`}
          accessibilityRole="button"
        />
        <AnimatedButton
          title={t.tradeDetail.sell}
          onPress={() => handleOrder('sell')}
          style={[styles.tradeButton, styles.sellButton]}
          textStyle={styles.tradeButtonText}
          accessibilityLabel={`Sell ${symbol.replace('USDT', '')} at ${formatPrice(currentPrice)}`}
          accessibilityRole="button"
        />
      </View>
    </View>
  );
};
