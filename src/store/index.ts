import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer, { hydrateUser } from './userSlice'; // Імпортуємо наш новий екшен
import { reduxStorage } from '../storage';

const rootReducer = combineReducers({
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

store.subscribe(() => {
  const state = store.getState();
  reduxStorage.setItem('root_state', JSON.stringify(state));
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
