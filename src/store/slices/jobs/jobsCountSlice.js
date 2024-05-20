// jobsCountSlice.js

import { createSlice } from "@reduxjs/toolkit";

const jobsCountSlice = createSlice({
  name: "jobsCount",
  initialState: {
    additionalFiltersCount: 0,
    allCount: 0,
    pendingCount: 0,
    unassignedCount: 0,
    scheduledCount: 0,
    assignedCount: 0,
    inprogressCount: 0,
    demoCount: 0,
    onholdCount: 0,
    deletedCount: 0,
    newJobsNotificationCount: 0,
  },
  reducers: {
    setCounts: (state, action) => {
      Object.keys(action.payload).map((key) => {
        state[key] = action.payload[key];
      });

      state.allCount = Object.keys(action.payload).reduce((sum, key) => {
        if (key === "pendingCount" || key === "allCount") {
          return sum + 0;
        }
        return sum + action.payload[key];
      }, 0);
    },

    setAdditionalFiltersCount: (state, action) => {
      state.additionalFiltersCount += action.payload;
    },
    setNewJobsNotificationCount: (state, action) => {
      console.log("setNewJobs: ", action.payload);
      state.newJobsNotificationCount = action.payload;
    },
  },
});

export const {
  setCounts,
  setAdditionalFiltersCount,
  setNewJobsNotificationCount,
} = jobsCountSlice.actions;

export default jobsCountSlice.reducer;
