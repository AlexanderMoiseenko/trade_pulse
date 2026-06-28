import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useAppDispatch } from '../../store/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { updateOnboardingData } from '../../store/userSlice';
import { ONBOARDING_STEPS, PROFESSIONS } from '../../constants/onboarding';

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
    backgroundColor: '#0A0A0C',
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
  },
  step: { color: '#34C759', fontWeight: '600', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 24 },
  listContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  selectedCard: { borderColor: '#34C759', backgroundColor: '#1C2E24' },
  cardText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  selectedCardText: { color: '#34C759' },
  button: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 60,
  },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
