import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { resetUser } from '../store/userSlice';
import { colors, spacing, borderRadius } from '../theme';

export const FeedScreen = () => {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetUser());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Trading Feed 📊</Text>
      <Text style={styles.subtitle}>Live market pulses will be here</Text>

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Onboarding</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg.primary,
    padding: spacing.xxl,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.xxxl,
  },
  button: {
    backgroundColor: colors.accent.red,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
