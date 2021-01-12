import { combineReducers } from '@reduxjs/toolkit';
import itemsReducer from "./slices/itemsSlice";
import fitsReducer from "./slices/fitsSlice";

const rootReducer = combineReducers({ items: itemsReducer, fits: fitsReducer });

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;