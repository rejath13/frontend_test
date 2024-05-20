// jobSlice.js

import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    data: null,
    jobDetails: null,
    sortOrderArray: null,
    singleFilteredJobsMappings: {},
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    getSingleJob: (state, action) => {
      const jobId = action.payload;
      state.jobDetails = state.data.find((item) => item.id === jobId);
    },
    setSortOrderArray: (state, action) => {
      state.sortOrderArray = action.payload;
    },

    updateJobsOrder: (state, action) => {
      const { filter, reorderedJobs } = action.payload;
      console.log("updateJobsOrder filter : ", filter);
      console.log("updateJobsOrder reorderedJobs : ", reorderedJobs);
      console.log("singleFilteredJobsMappings : ", state.singleFilteredJobsMappings[filter])
      // console.log(
      //   "Ordered item from updatejobsorder: ",
      //   reorderedJobs.filter((item) => item.orderedItemFlag)
      // );

    
      state.singleFilteredJobsMappings[filter] = reorderedJobs;
    },

    syncJobsOrderDb: (state, action) => {
      // console.log("sync Jobs order: ", action.payload);
      state.singleFilteredJobsMappings = action.payload;
      console.log(
        "Sync Jobs singleFilteredJobsMapping: ",
        JSON.parse(JSON.stringify(state.singleFilteredJobsMappings))
      );
    },

    setSingleFilteredJobs: (state, action) => {
      const { filter, filteredJobs: newJobs } = action.payload;

      // let tempData, newArray1, resultArray;
      console.log("inside setSingleFilteredJobs filter is : ", filter);
      // console.log(
      //   "inside setSingleFilteredJobs filtered jobs is : ",
      //   filteredJobs
      // );
      console.log("New Jobs: ", newJobs);

      // let addedJobs = newJobs.filter((item) => item.id !== stateJobs?.id);

      // console.log("Added Jobs: ", addedJobs);
      // let stateJobs = state.singleFilteredJobsMappings[filter];
      // if (stateJobs) {
      //   let addedJobs = newJobs.filter((item) => item.id !== stateJobs?.id);
      //   let stateJobs = Array.from(state.singleFilteredJobsMappings[filter]);
      //   console.log("State Jobs: ", JSON.parse(JSON.stringify(stateJobs)));
      //   console.log("Added Jobs: ", addedJobs);
      // }
      state.singleFilteredJobsMappings[filter] = newJobs;

      // tempData = state.singleFilteredJobsMappings[filter];

      // // Remove items not present in array2 from array1
      // console.log("temp data is ", tempData);

      // newArray1 = tempData?.filter((item) =>
      //   filteredJobs.some((job) => job.id === item.id)
      // );

      // console.log("New Array: ", newArray1);

      // // Concatenate array1 with the additional items from array2
      // resultArray = newArray1?.concat(
      //   filteredJobs.filter(
      //     (item) => !tempData?.some((job) => job.id === item.id)
      //   )
      // );
      // console.log("Result Array: ", resultArray);

      // state.singleFilteredJobsMappings[filter] = resultArray;
    },
  },
});

// Actions
export const {
  setData,
  getSingleJob,
  setSortOrderArray,
  setSingleFilteredJobs,
  updateJobsOrder,
  syncJobsOrderDb,
} = jobSlice.actions;

// Selectors
export const getJobDetails = (state) => state.jobs.jobDetails;

export default jobSlice.reducer;
