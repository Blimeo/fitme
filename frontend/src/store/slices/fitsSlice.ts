import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Fit, Gender } from "../../util/util-types";

export type FitsSliceState = {
  discoverData: Fit[];
  recommendedData: Fit[];
  lastUpdated: number; // unix timestamp
  currentGenderFilter: Gender[];
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
  gender: "UNISEX",
  favorited: 0,
};

export const fitsSlice = createSlice({
  name: "fits",
  initialState: {
    discoverData: [defaultFit],
    recommendedData: [defaultFit],
    lastUpdated: new Date().getTime(),
    currentGenderFilter: ["MEN", "WOMEN", "UNISEX"],
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
  },
});

export const {
  patchDiscover,
  patchRecommended,
  patchGenderFilter,
} = fitsSlice.actions;

export default fitsSlice.reducer;
