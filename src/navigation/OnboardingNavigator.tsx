import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { NameAgeScreen } from '../screens/onboarding/NameAgeScreen';
import { ProfessionScreen } from '../screens/onboarding/ProfessionScreen';
import { InterestsScreen } from '../screens/onboarding/InterestsScreen';
import { SourceScreen } from '../screens/onboarding/SourceScreen';
import { ONBOARDING_STEPS } from '../constants/onboarding';

export type OnboardingStackParamList = {
  [ONBOARDING_STEPS.NAME_AGE]: undefined;
  [ONBOARDING_STEPS.PROFESSION]: undefined;
  [ONBOARDING_STEPS.INTERESTS]: undefined;
  [ONBOARDING_STEPS.SOURCE]: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  const currentStep = useSelector((state: RootState) => state.user.currentStep);

  return (
    <Stack.Navigator
      initialRouteName={currentStep}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen
        name={ONBOARDING_STEPS.NAME_AGE}
        component={NameAgeScreen}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.PROFESSION}
        component={ProfessionScreen}
      />
      <Stack.Screen
        name={ONBOARDING_STEPS.INTERESTS}
        component={InterestsScreen}
      />
      <Stack.Screen name={ONBOARDING_STEPS.SOURCE} component={SourceScreen} />
    </Stack.Navigator>
  );
};
