import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

export const AppNavigator = () => {
  const isRegistered = useSelector(
    (state: RootState) => state.user.isRegistered,
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
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
