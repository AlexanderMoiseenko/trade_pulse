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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../store/hooks';
import {
  updateOnboardingData,
  completeOnboarding,
} from '../../store/userSlice';
import { isIOS } from '../../helpers/utils';
import { colors, spacing, borderRadius } from '../../theme';
import { t } from '../../helpers/i18n';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const SourceScreen = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

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
      style={[styles.container, { paddingTop: insets.top + spacing.lg }]}
    >
      <View style={styles.inner}>
        <View>
          <ProgressBar currentStep={4} totalSteps={4} />

          <Text style={styles.step}>
            {t.onboarding.step} 4 {t.onboarding.of} 4 ({t.onboarding.optional})
          </Text>
          <Text style={styles.title}>
            {t.onboarding.sourceTitle}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t.onboarding.sourcePlaceholder}
            placeholderTextColor={colors.text.placeholder}
            onChangeText={formik.handleChange('source')}
            value={formik.values.source}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
          <Text style={styles.buttonText}>{t.onboarding.startTrading}</Text>
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
  },
  step: {
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text.primary,
    marginBottom: spacing.xxl,
  },
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
