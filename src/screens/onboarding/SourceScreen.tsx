import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useFormik } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import {
  updateOnboardingData,
  completeOnboarding,
} from '../../store/userSlice';
import { isIOS } from '../../helpers/utils';
import { colors, spacing, borderRadius } from '../../theme';

import { ProgressBar } from '../../components/ui/ProgressBar';

export const SourceScreen = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: { source: '' },
    onSubmit: values => {
      dispatch(updateOnboardingData({ source: values.source.trim() }));
      dispatch(completeOnboarding()); // finishing onboarding, unlocking Feed
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View>
          <ProgressBar currentStep={4} totalSteps={4} />

          <Text style={styles.step}>Step 4 of 4 (Optional)</Text>
          <Text style={styles.title}>
            Where did you hear about Trade Pulse?
          </Text>
          <TextInput
            style={styles.input}
            placeholder="For example: GitHub, Google, LinkedIn, Reddit, Twitter, from friends..."
            placeholderTextColor={colors.text.placeholder}
            onChangeText={formik.handleChange('source')}
            value={formik.values.source}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
          <Text style={styles.buttonText}>Start Trading</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  progressContainer: {
    height: 4,
    backgroundColor: colors.bg.secondary,
    borderRadius: 2,
    marginBottom: spacing.xxxl,
    width: '100%',
  },
  progressBar: { height: '100%', backgroundColor: colors.accent.green, borderRadius: 2 },
  step: { color: colors.text.secondary, fontWeight: '600', marginBottom: spacing.sm },
  title: { fontSize: 24, fontWeight: '900', color: colors.text.primary, marginBottom: spacing.xxl },
  input: {
    backgroundColor: colors.bg.secondary,
    color: colors.text.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.accent.green,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.layoutBottom,
  },
  buttonText: { color: colors.text.dark, fontWeight: '700', fontSize: 16 },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
