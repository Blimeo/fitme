import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../util/util-types';

export type ItemsSliceState = {
  discoverData: Item[];
  recommendedData: Item[];
  lastUpdated: Date;
};

export const itemsSlice = createSlice({
  name: 'items',
  initialState: { discoverData: [], recommendedData: [], lastUpdated: new Date() } as ItemsSliceState,
  reducers: {
    patchDiscover: (state, action: PayloadAction<Item[]>) => {
      state.discoverData = action.payload;
      state.lastUpdated = new Date();
    },
    patchRecommended: (state, action: PayloadAction<Item[]>) => {
      state.recommendedData = action.payload;
      state.lastUpdated = new Date();
    },
  },
});

export const { patchDiscover, patchRecommended } = itemsSlice.actions;

export default itemsSlice.reducer;