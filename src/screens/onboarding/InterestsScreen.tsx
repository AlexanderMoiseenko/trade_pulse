import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../store/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { updateOnboardingData } from '../../store/userSlice';
import { ONBOARDING_STEPS, INTEREST_TAGS } from '../../constants/onboarding';
import { colors, spacing, borderRadius } from '../../theme';
import { t } from '../../helpers/i18n';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { AnimatedButton } from '../../components/ui/AnimatedButton';

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
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  const toggleTag = useCallback((tag: string) => {
    setSelected(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  }, []);

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

  const renderInterestItem = useCallback(
    ({ item }: { item: string }) => (
      <AnimatedTagCard
        item={item}
        isSelected={selected.includes(item)}
        onPress={() => toggleTag(item)}
      />
    ),
    [selected, toggleTag],
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
      <View style={styles.content}>
        <ProgressBar currentStep={3} totalSteps={4} />

        <Text style={styles.step}>
          {t.onboarding.step} 3 {t.onboarding.of} 4
        </Text>
        <Text style={styles.title}>{t.onboarding.interestsTitle}</Text>

        <View style={styles.listContainer}>
          <FlashList
            data={INTEREST_TAGS}
            renderItem={renderInterestItem}
            numColumns={2}
            extraData={selected}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <AnimatedButton
        title={t.onboarding.next}
        onPress={handleNext}
        disabled={selected.length === 0}
      />
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
  content: {
    flex: 1,
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
    marginBottom: spacing.lg,
  },
  listContainer: {
    flex: 1,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingBottom: 160,
  },
  tagCard: {
    flex: 1,
    margin: 6,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.bg.elevated,
    backgroundColor: colors.bg.secondary,
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
    backgroundColor: colors.state.selectedBg,
    borderColor: colors.accent.green,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
  },
  cardInner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 14,
    zIndex: 2,
  },
  tagText: {
    color: colors.text.subtle,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  selectedCardText: {
    color: colors.accent.green,
  },
});
