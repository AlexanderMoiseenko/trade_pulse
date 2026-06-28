import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { updateOnboardingData } from '../../store/userSlice';
import { ONBOARDING_STEPS, INTEREST_TAGS } from '../../constants/onboarding';

import { ProgressBar } from '../../components/ui/ProgressBar';

type InterestsScreenNavProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  typeof ONBOARDING_STEPS.INTERESTS
>;

interface Props {
  navigation: InterestsScreenNavProp;
}

const AnimatedTagCard = ({
  item,
  isSelected,
  onPress,
}: {
  item: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isSelected, opacityAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      tension: 140,
      friction: 7,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 140,
      friction: 7,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.tagCard,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.selectedOverlay,
          {
            opacity: opacityAnim,
          },
        ]}
      />

      <TouchableOpacity
        style={styles.cardInner}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
      >
        <Text
          numberOfLines={2}
          style={[styles.tagText, isSelected && styles.selectedCardText]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
      <View style={styles.content}>
        <ProgressBar currentStep={3} totalSteps={4} />

        <Text style={styles.step}>Step 3 of 4</Text>
        <Text style={styles.title}>What interests you?</Text>

        <View style={styles.listContainer}>
          <FlashList
            data={INTEREST_TAGS}
            renderItem={({ item }) => (
              <AnimatedTagCard
                item={item}
                isSelected={selected.includes(item)}
                onPress={() => toggleTag(item)}
              />
            )}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
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
  content: {
    flex: 1,
  },
  step: { color: '#34C759', fontWeight: '600', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 16 },
  listContainer: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 160,
  },
  tagCard: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    backgroundColor: '#1C1C1E',
    height: 84,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedOverlay: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    backgroundColor: '#1C2E24',
    borderColor: '#34C759',
    borderWidth: 1,
    borderRadius: 14,
  },
  cardInner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 14,
    zIndex: 2,
  },
  tagText: {
    color: '#E5E5EA',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  selectedCardText: {
    color: '#34C759',
  },
  button: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 60,
  },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
