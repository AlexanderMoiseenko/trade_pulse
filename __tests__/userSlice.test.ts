import userReducer, {
  updateOnboardingData,
  hydrateUser,
  completeOnboarding,
  updateBalance,
  setLanguage,
  resetUser,
  UserState,
} from '../src/store/userSlice';
import { ONBOARDING_STEPS } from '../src/constants/onboarding';

const initialState: UserState = {
  name: '',
  age: null,
  profession: '',
  interests: [],
  source: '',
  isRegistered: false,
  balance: 10000,
  currentStep: ONBOARDING_STEPS.NAME_AGE,
  language: 'en',
};

describe('userSlice reducers', () => {
  test('should return the initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle updateOnboardingData', () => {
    const nextState = userReducer(
      initialState,
      updateOnboardingData({ name: 'Oleksandr', age: 25 })
    );
    expect(nextState.name).toBe('Oleksandr');
    expect(nextState.age).toBe(25);
  });

  test('should handle hydrateUser', () => {
    const persistedState: UserState = {
      name: 'John',
      age: 30,
      profession: 'Developer',
      interests: ['Crypto'],
      source: 'Twitter',
      isRegistered: true,
      balance: 15000,
      currentStep: ONBOARDING_STEPS.SOURCE,
      language: 'en',
    };

    const nextState = userReducer(initialState, hydrateUser(persistedState));
    expect(nextState).toEqual(persistedState);
  });

  test('should handle completeOnboarding', () => {
    const nextState = userReducer(initialState, completeOnboarding());
    expect(nextState.isRegistered).toBe(true);
  });

  test('should handle updateBalance', () => {
    const nextState = userReducer(initialState, updateBalance(500));
    expect(nextState.balance).toBe(10500);

    const nextStateNegative = userReducer(nextState, updateBalance(-200));
    expect(nextStateNegative.balance).toBe(10300);
  });

  test('should handle setLanguage', () => {
    const nextState = userReducer(initialState, setLanguage('uk'));
    expect(nextState.language).toBe('uk');
  });

  test('should handle resetUser', () => {
    const modifiedState: UserState = {
      name: 'Alex',
      age: 28,
      profession: 'Designer',
      interests: ['Design'],
      source: 'Google',
      isRegistered: true,
      balance: 20000,
      currentStep: ONBOARDING_STEPS.SOURCE,
      language: 'uk',
    };

    const nextState = userReducer(modifiedState, resetUser());
    expect(nextState).toEqual(initialState);
  });
});

