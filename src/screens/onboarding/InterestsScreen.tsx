import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { updateOnboardingData } from '../../store/userSlice';
import { ONBOARDING_STEPS } from '../../constants/onboarding';

type InterestsScreenNavProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  typeof ONBOARDING_STEPS.INTERESTS
>;

interface Props {
  navigation: InterestsScreenNavProp;
}

const tags = [
  'AI & Autonomous Agents',
  'Crypto Volatility',
  'Market Psychology',
  'High-Frequency Algos',
];

export const InterestsScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelected(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const handleNext = () => {
    if (selected.length > 0) {
      dispatch(
        updateOnboardingData({
          interests: selected,
          currentStep: ONBOARDING_STEPS.SOURCE,
        }),
      );
      navigation.navigate(ONBOARDING_STEPS.SOURCE);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '75%' }]} />
        </View>

        <Text style={styles.step}>Step 3 of 4</Text>
        <Text style={styles.title}>What interests you?</Text>
        <View style={styles.tagsContainer}>
          {tags.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tag, selected.includes(t) && styles.selectedTag]}
              onPress={() => toggleTag(t)}
            >
              <Text
                style={[
                  styles.tagText,
                  selected.includes(t) && styles.selectedTagText,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, selected.length === 0 && { opacity: 0.5 }]}
        disabled={selected.length === 0}
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
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  selectedTag: { borderColor: '#34C759', backgroundColor: '#1C2E24' },
  tagText: { color: '#FFF', fontSize: 14 },
  selectedTagText: { color: '#34C759', fontWeight: '600' },
  button: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
