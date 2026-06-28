import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ActivityIndicator, StyleSheet, View, StatusBar } from 'react-native';
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

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0C" />

      <View style={styles.rootWrapper}>
        {!isHydrated ? (
          <View style={styles.splash}>
            <ActivityIndicator size="large" color="#34C759" />
          </View>
        ) : (
          <AppNavigator />
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
    backgroundColor: '#0A0A0C',
  },
  rootWrapper: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
});

export default App;
