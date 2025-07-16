import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import coinReducer from './coinSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    coins: coinReducer,
  },
  preloadedState: {
    coins: {
      total: 0,
      shouldRefresh: false,
      lastUpdated: null
    }
  }
});

export default store;