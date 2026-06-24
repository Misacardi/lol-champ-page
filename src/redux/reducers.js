import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  champions: [],
  loadingStatus: false,
  error: null,
  filterStatus: "all",
  darkTheme: true
};

const championSlice = createSlice({
  name: "championsListManipulation",
  initialState,
  reducers: {
    fetching(state) {
      state.loadingStatus = true;
      state.error = null;
    },
    fetched(state, action) {
      state.champions = action.payload;
      state.loadingStatus = false;
    },
    fetchingError(state, action) {
      state.loadingStatus = false;
      state.error = action.payload;
    },
    changeFilter(state, action) {
      state.filterStatus = action.payload;
    },
    change(state) {
      state.darkTheme = !state.darkTheme
    }
  },
});


export const { fetching, fetched, fetchingError, changeFilter, change } =
  championSlice.actions;
export default championSlice.reducer;
