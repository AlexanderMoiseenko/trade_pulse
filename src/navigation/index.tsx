import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { selectIsRegistered } from '../store/selectors/userSelectors';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { colors } from '../theme';

export type RootStackParamList = {
  OnboardingFlow: undefined;
  Feed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const TradePulseTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg.primary,
  },
};

export const AppNavigator = () => {
  const isRegistered = useAppSelector(selectIsRegistered);

  return (
    <NavigationContainer theme={TradePulseTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.bg.primary },
        }}
      >
        {!isRegistered ? (
          <Stack.Screen name="OnboardingFlow" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Feed" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
