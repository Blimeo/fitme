import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fit } from '../../util/util-types';

export type FitsSliceState = {
  discoverData: Fit[];
  recommendedData: Fit[];
  lastUpdated: Date;
};

export const fitsSlice = createSlice({
  name: 'fits',
  initialState: { discoverData: [], recommendedData: [], lastUpdated: new Date() } as FitsSliceState,
  reducers: {
    patchDiscover: (state, action: PayloadAction<Fit[]>) => {
      state.discoverData = action.payload;
      state.lastUpdated = new Date();
    },
    patchRecommended: (state, action: PayloadAction<Fit[]>) => {
      state.recommendedData = action.payload;
      state.lastUpdated = new Date();
    },
  },
});

export const { patchDiscover, patchRecommended } = fitsSlice.actions;

export default fitsSlice.reducer;