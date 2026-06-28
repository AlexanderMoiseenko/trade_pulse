import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectUserState = (state: RootState) => state.user;

export const selectIsRegistered = createSelector(
  selectUserState,
  (user) => user.isRegistered
);

export const selectCurrentStep = createSelector(
  selectUserState,
  (user) => user.currentStep
);

export const selectUserBalance = createSelector(
  selectUserState,
  (user) => user.balance
);

export const selectUserName = createSelector(
  selectUserState,
  (user) => user.name
);

export const selectUserAge = createSelector(
  selectUserState,
  (user) => user.age
);
