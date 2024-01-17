// spinnerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVisible: false,
};

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState,
  reducers: {
    showSpinner: (state) => {
      state.isVisible = true;
    },
    hideSpinner: (state) => {
      state.isVisible = false;
    },
  },
});

export const { showSpinner, hideSpinner } = spinnerSlice.actions;
export const selectSpinnerVisibility = (state) => state.spinner.isVisible;

export default spinnerSlice.reducer;
