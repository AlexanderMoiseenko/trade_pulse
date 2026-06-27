import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trade Pulse 📈</Text>
      <Text style={styles.subtitle}>Welcome to Trade Pulse App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
});