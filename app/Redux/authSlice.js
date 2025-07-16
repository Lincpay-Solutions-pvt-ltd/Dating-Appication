import { createSlice } from '@reduxjs/toolkit';
import coinReducer from './coinSlice';
const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("action.payload = ", action.payload);
      
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  coin: coinReducer,
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
