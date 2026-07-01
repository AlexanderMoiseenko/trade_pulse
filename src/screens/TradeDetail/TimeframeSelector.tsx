import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EaseView } from 'react-native-ease';
import { styles } from './styles';
import { TIMEFRAMES, type Timeframe } from '../../store/services/types';
import { spacing } from '../../theme';
import { t } from '../../helpers/i18n';

interface TimeframeSelectorProps {
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  screenWidth: number;
}

export const TimeframeSelector = ({
  timeframe,
  setTimeframe,
  screenWidth,
}: TimeframeSelectorProps) => {
  const [containerWidth, setContainerWidth] = useState(
    screenWidth - spacing.xxl * 2,
  );
  const buttonWidth = (containerWidth - 4) / 5;

  return (
    <View
      style={styles.timeframeContainer}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <EaseView
        animate={{
          translateX: TIMEFRAMES.indexOf(timeframe) * buttonWidth,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        style={[styles.timeframeHighlight, { width: buttonWidth }]}
      />
      {TIMEFRAMES.map(tf => {
        const isActive = timeframe === tf;
        return (
          <TouchableOpacity
            key={tf}
            style={[styles.timeframeButton, { width: buttonWidth }]}
            onPress={() => setTimeframe(tf)}
            activeOpacity={0.7}
            accessibilityLabel={t.a11y.timeframeSelect.replace('{{tf}}', tf)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.timeframeText,
                isActive && styles.timeframeTextActive,
              ]}
            >
              {tf}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
