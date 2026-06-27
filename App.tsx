import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { store, hydrateStore } from './src/store';
import { AppNavigator } from './src/navigation';

function App(): React.JSX.Element {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initStore = async () => {
      try {
        await hydrateStore();
      } catch (error) {
        console.error('Error hydrating store:', error);
      }
      setIsHydrated(true);
    };

    initStore();
  }, []);

  if (!isHydrated) {
    // Поки дані вичитуються з пам'яті — показуємо красивий лоадер
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#4CD964" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default App;