import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer, { hydrateUser } from './userSlice';
import { marketApi } from './services/marketApi';
import { reduxStorage } from '../storage';

const rootReducer = combineReducers({
  user: userReducer,
  [marketApi.reducerPath]: marketApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(marketApi.middleware),
});

const debouncedSave = (() => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (stateToSave: { user: ReturnType<typeof store.getState>['user'] }) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      reduxStorage.setItem('root_state', JSON.stringify(stateToSave));
    }, 300);
  };
})();

store.subscribe(() => {
  const state = store.getState();
  debouncedSave({ user: state.user });
});

export const hydrateStore = async () => {
  try {
    const savedState = await reduxStorage.getItem('root_state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.user) {
        store.dispatch(hydrateUser(parsedState.user));
      }
    }
  } catch (e) {
    console.error('Failed to hydrate store:', e);
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
