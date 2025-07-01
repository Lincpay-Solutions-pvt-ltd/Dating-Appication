// coinSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalAmount: 0,
};

const coinSlice = createSlice({
  name: 'coin',
  initialState,
  reducers: {
    add: (state, action) => {
      state.totalAmount += action.payload;
    },
    remove: (state, action) => {
      state.totalAmount -= action.payload;
    },
    setTotal: (state, action) => {
      state.totalAmount = action.payload;
    },
  },
});

export const { add, remove, setTotal } = coinSlice.actions;
export default coinSlice.reducer;
