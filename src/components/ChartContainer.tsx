/**
 * ChartContainer — wrapper for react-native-gifted-charts LineChart.
 *
 * React.memo prevents re-rendering on every WebSocket price tick,
 * as the component only re-renders when chartData/timeframe changes.
 *
 * Pointer config implements scrubbing: finger on chart → PriceTicker updates with current price.
 */

import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors, spacing } from '../theme';
import { formatSelectedDate } from '../helpers/formatters';
import type { ChartPoint, Timeframe } from '../store/services/types';

const screenWidth = Dimensions.get('window').width;

interface ChartContainerProps {
  chartData: ChartPoint[];
  isPositive: boolean;
  yAxisOffset: number;
  maxValue: number;
  setIsChartActive: (active: boolean) => void;
  setScrubbedPrice: (price: number | null) => void;
  setScrubbedTime: (time: string | null) => void;
  isScrubbingRef: React.MutableRefObject<boolean>;
  isUa: boolean;
  timeframe: Timeframe;
}

// ---------------------------------------------------------------------------
// Chart Colors (computed once, not during render)
// ---------------------------------------------------------------------------
const CHART_COLORS = {
  positive: {
    line: colors.accent.green,
    fill: 'rgba(16, 185, 129, 0.24)',
  },
  negative: {
    line: colors.accent.red,
    fill: 'rgba(239, 68, 68, 0.24)',
  },
  fillEnd: 'rgba(0,0,0,0.01)',
  rules: 'rgba(255,255,255,0.05)',
  pointerStrip: 'rgba(255, 255, 255, 0.2)',
} as const;

export const ChartContainer = React.memo(
  ({
    chartData,
    isPositive,
    yAxisOffset,
    maxValue,
    setIsChartActive,
    setScrubbedPrice,
    setScrubbedTime,
    isScrubbingRef,
    isUa,
    timeframe,
  }: ChartContainerProps) => {
    const palette = isPositive ? CHART_COLORS.positive : CHART_COLORS.negative;

    return (
      <LineChart
        data={chartData}
        height={200}
        width={screenWidth - spacing.xxl * 2 - 48}
        yAxisLabelWidth={48}
        parentWidth={screenWidth - spacing.xxl * 2}
        disableScroll
        adjustToWidth
        initialSpacing={10}
        endSpacing={0}
        areaChart
        thickness={2}
        curved
        curvature={0.08}
        animateOnDataChange
        animationDuration={400}
        yAxisOffset={yAxisOffset}
        maxValue={maxValue}
        color={palette.line}
        startFillColor={palette.fill}
        endFillColor={CHART_COLORS.fillEnd}
        startOpacity={0.24}
        endOpacity={0.01}
        noOfSections={4}
        rulesColor={CHART_COLORS.rules}
        rulesType="dashed"
        yAxisColor="transparent"
        xAxisColor="transparent"
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        hideDataPoints
        xAxisLabelsVerticalShift={5}
        pointerConfig={{
          pointerStripUptoDataPoint: true,
          pointerStripColor: CHART_COLORS.pointerStrip,
          pointerStripWidth: 1.5,
          strokeDashArray: [3, 4],
          pointerColor: palette.line,
          radius: 6,
          pointerLabelComponent: (items: ChartPoint[]) => {
            if (!isScrubbingRef.current) return null;

            const point = items?.[0];
            if (point) {
              // setTimeout(0) — allows updating the parent component state
              // without violating the React rendering cycle (setState during render)
              setTimeout(() => {
                if (!isScrubbingRef.current) return;
                setScrubbedPrice(point.value);
                setIsChartActive(true);
                setScrubbedTime(
                  point.timestamp
                    ? formatSelectedDate(point.timestamp, timeframe, isUa)
                    : null,
                );
              }, 0);
            } else {
              setTimeout(() => {
                setScrubbedPrice(null);
                setScrubbedTime(null);
                setIsChartActive(false);
              }, 0);
            }

            return null;
          },
        }}
      />
    );
  },
);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  axisText: {
    color: colors.text.subtle,
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '600',
    width: 32,
  },
});
