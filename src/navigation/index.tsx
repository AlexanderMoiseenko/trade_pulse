import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { selectIsRegistered } from '../store/selectors/userSelectors';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { BiometricGateScreen } from '../screens/BiometricGateScreen';
import { TradeDetailScreen } from '../screens/TradeDetail';
import { colors } from '../theme';

export type RootStackParamList = {
  OnboardingFlow: undefined;
  Feed: undefined;
  TradeDetail: { symbol: string };
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
  const isBiometricsEnabled = useAppSelector((state) => state.user.isBiometricsEnabled);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Gated entry: if user is registered and biometrics is active, block dashboard until FaceID scan passes
  if (isRegistered && isBiometricsEnabled && !isUnlocked) {
    return <BiometricGateScreen onUnlock={() => setIsUnlocked(true)} />;
  }

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
          <Stack.Group>
            <Stack.Screen name="Feed" component={MainTabNavigator} />
            <Stack.Screen name="TradeDetail" component={TradeDetailScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
