import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  champions: [],
  loadingStatus: false,
  filterStatus: "all",
  darkTheme: true
};

const championSlice = createSlice({
  name: "championsListManipulation",
  initialState,
  reducers: {
    fetching(state) {
      state.loadingStatus = true;
    },
    fetched(state, action) {
      state.champions = action.payload;
      state.loadingStatus = false;
    },
    changeFilter(state, action) {
      state.filterStatus = action.payload;
    },
    change(state) {
      state.darkTheme = !state.darkTheme
    }
  },
});


export const { fetching, fetched, changeFilter, change } = championSlice.actions;
export default championSlice.reducer;
