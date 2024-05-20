// scheduleCountSlice.js

import { createSlice } from "@reduxjs/toolkit";

const scheduleCountSlice = createSlice({
  name: "scheduleCount",
  initialState: {
    allPendingCount: 0,
    schedulesCount: 0,
    assignedCount: 0,
    partialCount: 0,
    completedCount: 0,
  },
  reducers: {
    setScheduleCounts: (state, action) => {
      //   console.log("setScheduleCounts action payload: ", action.payload);
      Object.keys(action.payload).map((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

// Reducer ====================================================/
export default scheduleCountSlice.reducer;

// Actions ====================================================/
export const { setScheduleCounts } = scheduleCountSlice.actions;

// Selectors ====================================================/
export const getScheduleCounts = (state) => state.schedulerCount;
