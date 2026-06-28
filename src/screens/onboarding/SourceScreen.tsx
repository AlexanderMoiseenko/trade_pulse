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
import { useDispatch } from 'react-redux';
import {
  updateOnboardingData,
  completeOnboarding,
} from '../../store/userSlice';
import { isIOS } from '../../helpers/utils';

import { ProgressBar } from '../../components/ui/ProgressBar';

export const SourceScreen = () => {
  const dispatch = useDispatch();

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
            placeholderTextColor="#555"
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
  step: { color: '#8E8E93', fontWeight: '600', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '900', color: '#FFF', marginBottom: 24 },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 60,
  },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 16 },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
