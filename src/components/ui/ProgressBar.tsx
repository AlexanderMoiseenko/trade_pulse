import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

interface ProgressBarProps {
  /** Current step, starting from 1 */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
}

export const ProgressBar = React.memo(
  ({ currentStep, totalSteps }: ProgressBarProps) => {
    // Calculate progress percentage (from 0 to 1)
    const targetProgress = Math.min(Math.max(currentStep / totalSteps, 0), 1);

    // Use animated value for width (from 0 to 100%)
    const animatedWidth = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      // Animate progress smoothly
      Animated.timing(animatedWidth, {
        toValue: targetProgress * 100,
        duration: 300,
        useNativeDriver: false, // width is not supported by native driver, but this is a simple layout pass, so it's fine
      }).start();
    }, [targetProgress]);

    // Transform numeric value to percentage for style
    const widthInterpolation = animatedWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.bar, { width: widthInterpolation }]} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    height: 4,
    backgroundColor: '#1C1C1E',
    borderRadius: 2,
    marginBottom: 32,
    width: '100%',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#34C759', // accent green
    borderRadius: 2,
  },
});
