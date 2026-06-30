import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme';
import { t } from '../../helpers/i18n';
import { formatPrice } from '../../helpers/formatters';
import { styles } from './styles';

interface PriceTickerProps {
  currentPrice: number;
  scrubbedPrice: number | null;
  scrubbedTime: string | null;
  priceFlashColor: string;
  isPositive: boolean;
  priceChangePercent: string;
}

export const PriceTicker = ({
  currentPrice,
  scrubbedPrice,
  scrubbedTime,
  priceFlashColor,
  isPositive,
  priceChangePercent,
}: PriceTickerProps) => {
  return (
    <View style={styles.priceContainer}>
      <View style={styles.priceInfoBlock}>
        <Text
          style={[
            styles.livePriceText,
            {
              color:
                scrubbedPrice !== null
                  ? colors.text.primary
                  : priceFlashColor,
            },
          ]}
        >
          {formatPrice(scrubbedPrice !== null ? scrubbedPrice : currentPrice)}
        </Text>
        <Text
          style={[
            styles.priceLabel,
            scrubbedPrice !== null
              ? styles.priceLabelSelected
              : styles.priceLabelLive,
          ]}
        >
          {scrubbedPrice !== null
            ? `${t.tradeDetail.priceAt} ${scrubbedTime || ''}`
            : t.tradeDetail.livePrice}
        </Text>
      </View>
      
      {scrubbedPrice === null && (
        <View
          style={[
            styles.badge,
            isPositive ? styles.badgePositive : styles.badgeNegative,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isPositive ? styles.textPositive : styles.textNegative,
            ]}
          >
            {isPositive ? '+' : ''}
            {parseFloat(priceChangePercent).toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
};
