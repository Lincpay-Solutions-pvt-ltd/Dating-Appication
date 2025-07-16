import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total: null, 
  shouldRefresh: false,
  lastUpdated: null,
  status: 'idle'
};

const coinSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setTotal: (state, action) => {
      state.total = action.payload;
      state.lastUpdated = Date.now();
      state.status = 'succeeded';
    },
    requestRefresh: (state) => {
      state.shouldRefresh = true;
      state.status = 'loading';
    },
    completeRefresh: (state) => {
      state.shouldRefresh = false;
    },
    setError: (state, action) => {
      state.status = 'failed';
    },
    // Add this new action to force update from API response
    updateFromTransaction: (state, action) => {
      state.total = action.payload;
      state.lastUpdated = Date.now();
    }
  }
});

export const { setTotal, requestRefresh, completeRefresh, setError, updateFromTransaction } = coinSlice.actions;
export default coinSlice.reducer;
