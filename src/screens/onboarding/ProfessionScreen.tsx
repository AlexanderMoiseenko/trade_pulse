import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../../store/hooks';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { updateOnboardingData } from '../../store/userSlice';
import { ONBOARDING_STEPS, PROFESSIONS } from '../../constants/onboarding';
import { colors, spacing, borderRadius } from '../../theme';
import { t } from '../../helpers/i18n';

import { ProgressBar } from '../../components/ui/ProgressBar';
import { AnimatedButton } from '../../components/ui/AnimatedButton';

type ProfessionScreenNavProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  typeof ONBOARDING_STEPS.PROFESSION
>;

interface Props {
  navigation: ProfessionScreenNavProp;
}

export const ProfessionScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string>('');
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (selected) {
      dispatch(
        updateOnboardingData({
          profession: selected,
          currentStep: ONBOARDING_STEPS.INTERESTS,
        }),
      );
      navigation.navigate(ONBOARDING_STEPS.INTERESTS);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <TouchableOpacity
        style={[styles.card, selected === item && styles.selectedCard]}
        onPress={() => setSelected(item)}
      >
        <Text
          style={[
            styles.cardText,
            selected === item && styles.selectedCardText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ),
    [selected],
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.lg,
          paddingBottom: Math.max(insets.bottom, spacing.xxl),
        },
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.listContainer}>
          <ProgressBar currentStep={2} totalSteps={4} />

          <Text style={styles.step}>
            {t.onboarding.step} 2 {t.onboarding.of} 4
          </Text>
          <Text style={styles.title}>{t.onboarding.professionTitle}</Text>

          <FlashList
            data={[...PROFESSIONS]}
            renderItem={renderItem}
            extraData={selected}
          />
        </View>

        <AnimatedButton
          title={t.onboarding.next}
          onPress={handleNext}
          disabled={!selected}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'space-between',
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  step: {
    color: colors.accent.green,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: spacing.xxl,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
  },
  selectedCard: {
    borderColor: colors.accent.green,
    backgroundColor: colors.state.selectedBg,
  },
  cardText: { color: colors.text.primary, fontSize: 16, fontWeight: '500' },
  selectedCardText: { color: colors.accent.green },
});
