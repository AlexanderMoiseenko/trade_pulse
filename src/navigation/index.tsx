import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { OnboardingNavigator } from './OnboardingNavigator';
import { FeedScreen } from '../screens/FeedScreen';

export type RootStackParamList = {
  OnboardingFlow: undefined;
  Feed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const TradePulseTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0A0A0C',
  },
};

export const AppNavigator = () => {
  const isRegistered = useSelector(
    (state: RootState) => state.user.isRegistered,
  );

  return (
    <NavigationContainer theme={TradePulseTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0A0A0C' },
        }}
      >
        {!isRegistered ? (
          <Stack.Screen name="OnboardingFlow" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Feed" component={FeedScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
