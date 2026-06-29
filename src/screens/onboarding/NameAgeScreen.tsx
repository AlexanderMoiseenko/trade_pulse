import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectUserName,
  selectUserAge,
} from '../../store/selectors/userSelectors';
import { updateOnboardingData } from '../../store/userSlice';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { isIOS } from '../../helpers/utils';
import { ONBOARDING_STEPS } from '../../constants/onboarding';
import { colors, spacing, borderRadius } from '../../theme';
import { t } from '../../helpers/i18n';

import { ProgressBar } from '../../components/ui/ProgressBar';

type NameAgeScreenNavProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  typeof ONBOARDING_STEPS.NAME_AGE
>;

interface Props {
  navigation: NameAgeScreenNavProp;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .typeError(t.onboarding.yupNameRequired)
    .min(3, t.onboarding.yupNameRequired)
    .required(t.onboarding.yupNameRequired),
  age: Yup.number()
    .typeError(t.onboarding.yupAgeNumber)
    .min(18, t.onboarding.yupAgeMin)
    .required(t.onboarding.yupAgeRequired),
});

export const NameAgeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const userName = useAppSelector(selectUserName);
  const userAge = useAppSelector(selectUserAge);
  const insets = useSafeAreaInsets();

  const formik = useFormik({
    initialValues: {
      name: userName || '',
      age: userAge ? String(userAge) : '',
    },
    validationSchema,
    onSubmit: values => {
      dispatch(
        updateOnboardingData({
          name: values.name,
          age: parseInt(values.age, 10),
          currentStep: ONBOARDING_STEPS.PROFESSION,
        }),
      );
      navigation.navigate(ONBOARDING_STEPS.PROFESSION);
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : undefined}
      style={[styles.container, { paddingTop: insets.top + spacing.lg }]}
    >
      <View style={styles.inner}>
        <View>
          <ProgressBar currentStep={1} totalSteps={4} />

          <Text style={styles.step}>
            {t.onboarding.step} 1 {t.onboarding.of} 4
          </Text>
          <Text style={styles.title}>{t.onboarding.nameAgeTitle}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.onboarding.nameLabel}</Text>
            <TextInput
              style={[
                styles.input,
                formik.touched.name && formik.errors.name && styles.inputError,
              ]}
              placeholder={t.onboarding.namePlaceholder}
              placeholderTextColor={colors.text.placeholder}
              onChangeText={formik.handleChange('name')}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <Text style={styles.error}>{formik.errors.name}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.onboarding.ageLabel}</Text>
            <TextInput
              style={[
                styles.input,
                formik.touched.age && formik.errors.age && styles.inputError,
              ]}
              placeholder={t.onboarding.agePlaceholder}
              placeholderTextColor={colors.text.placeholder}
              keyboardType="numeric"
              onChangeText={formik.handleChange('age')}
              value={formik.values.age}
            />
            {formik.touched.age && formik.errors.age && (
              <Text style={styles.error}>{formik.errors.age}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => formik.handleSubmit()}>
          <Text style={styles.buttonText}>{t.onboarding.next}</Text>
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
  inner: {
    flex: 1,
    justifyContent: 'space-between',
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
    marginBottom: spacing.xxl,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 28, // keep space for error message
  },
  label: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.bg.secondary,
    color: colors.text.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent', // prevent border flicker
  },
  inputError: { borderColor: colors.accent.red },
  error: {
    position: 'absolute',
    bottom: -20, // keep text under the input
    left: 4,
    color: colors.accent.red,
    fontSize: 12,
  },
  button: {
    backgroundColor: colors.accent.green,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.layoutBottom,
  },
  buttonText: { color: colors.text.dark, fontWeight: '700', fontSize: 16 },
});
