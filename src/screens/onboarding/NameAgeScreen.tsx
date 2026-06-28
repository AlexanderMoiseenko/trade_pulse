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
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '../../store/userSlice';
import { RootState } from '../../store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { isIOS } from '../../helpers/utils';
import { ONBOARDING_STEPS } from '../../constants/onboarding';

import { ProgressBar } from '../../components/ui/ProgressBar';

type NameAgeScreenNavProp = NativeStackNavigationProp<
  OnboardingStackParamList,
  typeof ONBOARDING_STEPS.NAME_AGE
>;

interface Props {
  navigation: NameAgeScreenNavProp;
}

export const NameAgeScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const formik = useFormik({
    initialValues: { name: user.name, age: user.age ? String(user.age) : '' },
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
              placeholderTextColor="#555"
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
              placeholderTextColor="#555"
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
    backgroundColor: '#0A0A0C',
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
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
  inputContainer: {
    position: 'relative',
    marginBottom: 28, // keep space for error message
  },
  label: { color: '#8E8E93', marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent', // prevent border flicker
  },
  inputError: { borderColor: '#FF3B30' },
  error: {
    position: 'absolute',
    bottom: -20, // keep text under the input
    left: 4,
    color: '#FF3B30',
    fontSize: 12,
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
