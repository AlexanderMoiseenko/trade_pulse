import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ActivityIndicator, StyleSheet, View, StatusBar } from 'react-native';
import { store, hydrateStore } from './src/store';
import { AppNavigator } from './src/navigation';
import { colors } from './src/theme';
import { ErrorBoundary } from './src/components/ErrorBoundary';

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

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.primary} />

      <View style={styles.rootWrapper}>
        {!isHydrated ? (
          <View style={styles.splash}>
            <ActivityIndicator size="large" color={colors.accent.green} />
          </View>
        ) : (
          <ErrorBoundary>
            <AppNavigator />
          </ErrorBoundary>
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg.primary,
  },
  rootWrapper: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
});

export default App;
