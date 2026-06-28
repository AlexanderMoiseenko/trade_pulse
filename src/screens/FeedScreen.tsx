import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const FeedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Trading Feed 📊</Text>
      <Text style={styles.subtitle}>Live market pulses will be here</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CD964',
  },
});
