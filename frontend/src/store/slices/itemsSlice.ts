import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../util/util-types';
import { RootState } from "../rootReducer";

export type ItemsSliceState = {
  itemsData: Item[];
  lastUpdated: Date;
};

export const itemsSlice = createSlice({
  name: 'items',
  initialState: { itemsData: [], lastUpdated: new Date() } as ItemsSliceState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.itemsData = action.payload;
      state.lastUpdated = new Date();
    },
  },
});

export const patchItems = (state: RootState, updatedItems: Item[]): RootState => {
  return {...state, items: { itemsData: updatedItems, lastUpdated: new Date() }};
}

export const selectItems = ({ items }: RootState) => items.itemsData;

export const { setItems } = itemsSlice.actions;

export default itemsSlice.reducer;