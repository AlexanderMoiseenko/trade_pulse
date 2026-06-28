import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { updateOnboardingData } from '../../store/userSlice';
import { ONBOARDING_STEPS } from '../../constants/onboarding';

const professions = [
  'Senior Frontend Developer',
  'Crypto Architect',
  'Data Scientist',
  'Day Trader',
  'Blockchain Developer',
  'AI Researcher',
  'Investment Banker',
] as const;

type ProfessionScreenNavProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  typeof ONBOARDING_STEPS.PROFESSION
>;

interface Props {
  navigation: ProfessionScreenNavProp;
}

export const ProfessionScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
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

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '50%' }]} />
        </View>

        <Text style={styles.step}>Step 2 of 4</Text>
        <Text style={styles.title}>Your Profession</Text>
        {professions.map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.card, selected === p && styles.selectedCard]}
            onPress={() => setSelected(p)}
          >
            <Text
              style={[
                styles.cardText,
                selected === p && styles.selectedCardText,
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
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
  progressContainer: {
    height: 4,
    backgroundColor: '#1C1C1E',
    borderRadius: 2,
    marginBottom: 32,
    width: '100%',
  },
  progressBar: { height: '100%', backgroundColor: '#34C759', borderRadius: 2 },
  step: { color: '#34C759', fontWeight: '600', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 24 },
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
  },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
