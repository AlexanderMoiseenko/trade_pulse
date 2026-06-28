import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useAppDispatch } from '../../store/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { updateOnboardingData } from '../../store/userSlice';
import { ONBOARDING_STEPS, PROFESSIONS } from '../../constants/onboarding';
import { colors, spacing, borderRadius } from '../../theme';

import { ProgressBar } from '../../components/ui/ProgressBar';

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

  const renderItem = ({ item }: { item: string }) => (
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
  );

  return (
    <View style={styles.container}>
      <ProgressBar currentStep={2} totalSteps={4} />

      <Text style={styles.step}>Step 2 of 4</Text>
      <Text style={styles.title}>Your Profession</Text>

      <View style={styles.listContainer}>
        <FlashList
          data={PROFESSIONS as unknown as string[]}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !selected && { opacity: 0.5 }]}
        disabled={!selected}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    padding: spacing.xxl,
    justifyContent: 'space-between',
    paddingTop: spacing.layoutTop,
  },
  step: { color: colors.accent.green, fontWeight: '600', marginBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '900', color: colors.text.primary, marginBottom: spacing.xxl },
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
  selectedCard: { borderColor: colors.accent.green, backgroundColor: colors.state.selectedBg },
  cardText: { color: colors.text.primary, fontSize: 16, fontWeight: '500' },
  selectedCardText: { color: colors.accent.green },
  button: {
    backgroundColor: colors.accent.green,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.layoutBottom,
  },
  buttonText: { color: colors.text.dark, fontWeight: '700', fontSize: 16 },
});
