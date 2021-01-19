import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gender, Item } from "../../util/util-types";

export type ItemsSliceState = {
  discoverData: Item[];
  recommendedData: Item[];
  lastUpdated: number; // unix timestamp
  currentGenderFilter: Gender[];
  currentCategoryFilter: string;
  currentPage: number;
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
  gender: "Unisex",
  favorited: 0,
  inFits: [],
  category: "",
  uploadDate: "",
  color: "",
};

export const itemsSlice = createSlice({
  name: "items",
  initialState: {
    discoverData: [defaultItem],
    recommendedData: [defaultItem],
    lastUpdated: new Date().getTime(),
    currentGenderFilter: ["Men", "Women", "Unisex"],
    currentCategoryFilter: "any",
    currentPage: 1,
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
    patchCategoryFilter: (state, { payload }: PayloadAction<string>) => {
      state.currentCategoryFilter = payload;
      state.lastUpdated = new Date().getTime();
    },
    patchPage: (state, { payload }: PayloadAction<number>) => {
      state.currentPage = payload;
      state.lastUpdated = new Date().getTime();
    },
  },
});

export const {
  patchDiscover,
  patchRecommended,
  patchGenderFilter,
  patchCategoryFilter,
  patchPage,
} = itemsSlice.actions;

export default itemsSlice.reducer;
