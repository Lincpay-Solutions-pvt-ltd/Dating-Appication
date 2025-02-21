import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login2: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout2: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login2, logout2 } = authSlice.actions;
export default authSlice.reducer;
