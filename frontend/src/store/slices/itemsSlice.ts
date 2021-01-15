import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gender, Item } from "../../util/util-types";

export type ItemsSliceState = {
  discoverData: Item[];
  recommendedData: Item[];
  lastUpdated: number; // unix timestamp
  currentGenderFilter: Gender[];
};

const defaultItem: Item = {
  _id: "LOADING",
  name: "",
  brand: "",
  price: 0,
  tags: [],
  description: "",
  uploader: "",
  imgs: [],
  gender: "UNISEX",
  favorited: 0,
  inFits: [],
};

export const itemsSlice = createSlice({
  name: "items",
  initialState: {
    discoverData: [defaultItem],
    recommendedData: [defaultItem],
    lastUpdated: new Date().getTime(),
    currentGenderFilter: ["MEN", "WOMEN", "UNISEX"],
  } as ItemsSliceState,
  reducers: {
    patchDiscover: (state, { payload }: PayloadAction<Item[]>) => {
      state.discoverData = payload;
      state.lastUpdated = new Date().getTime();
    },
    patchRecommended: (state, { payload }: PayloadAction<Item[]>) => {
      state.recommendedData = payload;
      state.lastUpdated = new Date().getTime();
    },
    patchGenderFilter: (state, { payload }: PayloadAction<Gender[]>) => {
      state.currentGenderFilter = payload;
      state.lastUpdated = new Date().getTime();
    },
  },
});

export const {
  patchDiscover,
  patchRecommended,
  patchGenderFilter,
} = itemsSlice.actions;

export default itemsSlice.reducer;
