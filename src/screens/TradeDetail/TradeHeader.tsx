import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { t } from '../../helpers/i18n';
import type { RootStackParamList } from '../../navigation';
import { styles } from './styles';

interface TradeHeaderProps {
  symbol: string;
  assetName: string;
}

export const TradeHeader = ({ symbol, assetName }: TradeHeaderProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={navigation.goBack}
        accessibilityLabel={t.a11y.goBack}
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
