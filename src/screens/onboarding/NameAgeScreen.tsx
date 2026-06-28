import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUserName, selectUserAge } from '../../store/selectors/userSelectors';
import { updateOnboardingData } from '../../store/userSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { isIOS } from '../../helpers/utils';
import { ONBOARDING_STEPS } from '../../constants/onboarding';
import { colors, spacing, borderRadius } from '../../theme';

import { ProgressBar } from '../../components/ui/ProgressBar';

type NameAgeScreenNavProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  typeof ONBOARDING_STEPS.NAME_AGE
>;

interface Props {
  navigation: NameAgeScreenNavProp;
}

export const NameAgeScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const userName = useAppSelector(selectUserName);
  const userAge = useAppSelector(selectUserAge);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const formik = useFormik({
    initialValues: { name: userName, age: userAge ? String(userAge) : '' },
    validationSchema: Yup.object({
      name: Yup.string()
        .typeError('Should be a text')
        .min(3, 'Should be at least 3 characters')
        .required('Name is required'),
      age: Yup.number()
        .typeError('Should be a number')
        .min(18, 'Should be at least 18 years old')
        .required('Age is required'),
    }),
    onSubmit: values => {
      dispatch(
        updateOnboardingData({
          name: values.name,
          age: Number(values.age),
          currentStep: ONBOARDING_STEPS.PROFESSION,
        }),
      );
      navigation.navigate(ONBOARDING_STEPS.PROFESSION);
    },
  });

  const animate = (toValue: number) => {
    Animated.spring(scaleAnim, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 5,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View>
          <ProgressBar currentStep={1} totalSteps={4} />

          <Text style={styles.step}>Step 1 of 4</Text>
          <Text style={styles.title}>Name and Age</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              style={[
                styles.input,
                formik.touched.name && formik.errors.name && styles.inputError,
              ]}
              placeholder="Enter your name..."
              placeholderTextColor={colors.text.placeholder}
              onChangeText={formik.handleChange('name')}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <Text style={styles.error}>{formik.errors.name}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Age</Text>
            <TextInput
              style={[
                styles.input,
                formik.touched.age && formik.errors.age && styles.inputError,
              ]}
              placeholder="Enter your age..."
              placeholderTextColor={colors.text.placeholder}
              keyboardType="numeric"
              onChangeText={formik.handleChange('age')}
              value={formik.values.age}
              onSubmitEditing={() => formik.handleSubmit()}
            />
            {formik.touched.age && formik.errors.age && (
              <Text style={styles.error}>{formik.errors.age}</Text>
            )}
          </View>
        </View>

        <TouchableWithoutFeedback
          onPressIn={() => animate(0.95)}
          onPressOut={() => animate(1)}
          onPress={() => formik.handleSubmit()}
        >
          <Animated.View
            style={[styles.button, { transform: [{ scale: scaleAnim }] }]}
          >
            <Text style={styles.buttonText}>Next</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
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
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.bg.secondary,
    borderRadius: 2,
    marginBottom: spacing.xxxl,
    width: '100%',
  },
  progressBar: { height: '100%', backgroundColor: colors.accent.green, borderRadius: 2 },
  step: { color: colors.accent.green, fontWeight: '600', marginBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '900', color: colors.text.primary, marginBottom: spacing.xxl },
  inputContainer: {
    position: 'relative',
    marginBottom: 28, // keep space for error message
  },
  label: { color: colors.text.secondary, marginBottom: spacing.sm, fontSize: 14 },
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
