// Pagination Slice

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 1,
  itemsPerPage: 10,
  allData: [],
};

const paginationSlice = createSlice({
  name: "pagination",

  initialState: initialState,

  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    incrementPage: (state) => {
      state.currentPage += 1;
    },

    appendData: (state, action) => {
      state.allData = state.allData.concat(action.payload);
    },
  },
});

export const { setCurrentPage, incrementPage, appendData } =
  paginationSlice.actions;

export default paginationSlice.reducer;
