import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Fit, Gender } from "../../util/util-types";

export type FitsSliceState = {
  discoverData: Fit[];
  recommendedData: Fit[];
  lastUpdated: number; // unix timestamp
  currentGenderFilter: Gender[];
  currentPage: number;
};

const defaultFit: Fit = {
  _id: "LOADING",
  name: "",
  tags: [],
  description: "",
  img_url: "",
  items: [],
  uploader: "",
  annotations: [],
  gender: "Unisex",
  favorited: 0,
  uploadDate: ""
};

export const fitsSlice = createSlice({
  name: "fits",
  initialState: {
    discoverData: [defaultFit],
    recommendedData: [defaultFit],
    lastUpdated: new Date().getTime(),
    currentGenderFilter: ["Men", "Women", "Unisex"],
    currentPage: 1,
  } as FitsSliceState,
  reducers: {
    patchDiscover: (state, action: PayloadAction<Fit[]>) => {
      state.discoverData = action.payload;
      state.lastUpdated = new Date().getTime();
    },
    patchRecommended: (state, action: PayloadAction<Fit[]>) => {
      state.recommendedData = action.payload;
      state.lastUpdated = new Date().getTime();
    },
    patchGenderFilter: (state, { payload }: PayloadAction<Gender[]>) => {
      state.currentGenderFilter = payload;
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
  patchPage,
} = fitsSlice.actions;

export default fitsSlice.reducer;
