import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { t } from '../../helpers/i18n';
import { styles } from './styles';

interface TradeHeaderProps {
  symbol: string;
  assetName: string;
}

export const TradeHeader = ({ symbol, assetName }: TradeHeaderProps) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={navigation.goBack}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Text style={styles.backText}>← {t.tradeDetail.back}</Text>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.symbolTitle}>
          {symbol.replace('USDT', '')} / USDT
        </Text>
        <Text style={styles.nameSubTitle}>{assetName}</Text>
      </View>

      <View style={styles.placeholder} />
    </View>
  );
};
