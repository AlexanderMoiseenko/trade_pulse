import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ONBOARDING_STEPS, type OnboardingStep } from '../constants/onboarding';

export interface UserState {
  name: string;
  age: number | null;
  profession: string;
  interests: string[];
  source: string;
  isRegistered: boolean;
  balance: number;
  currentStep: OnboardingStep;
}

const initialState: UserState = {
  name: '',
  age: null,
  profession: '',
  interests: [],
  source: '',
  isRegistered: false,
  balance: 10000,
  currentStep: ONBOARDING_STEPS.NAME_AGE,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateOnboardingData: (
      state,
      action: PayloadAction<Partial<UserState>>,
    ) => {
      return { ...state, ...action.payload };
    },
    hydrateUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    completeOnboarding: state => {
      state.isRegistered = true;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
    },
    resetUser: () => initialState,
  },
});

export const {
  updateOnboardingData,
  hydrateUser,
  completeOnboarding,
  updateBalance,
  resetUser,
} = userSlice.actions;
export default userSlice.reducer;
