import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  name: string;
  isRegistered: boolean;
  balance: number;
  avatar?: string;
}

const initialState: UserState = {
  name: '',
  isRegistered: false,
  balance: 10000, // for testing
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<{ name: string; avatar?: string }>) => {
      const { name, avatar } = action.payload;
      state.name = name || state.name;
      state.avatar = avatar || state.avatar;
      state.isRegistered = true;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
    },
    resetUser: () => initialState,
  },
});

export const { registerUser, updateBalance, resetUser } = userSlice.actions;
export default userSlice.reducer;