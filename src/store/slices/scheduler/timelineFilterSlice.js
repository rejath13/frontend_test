import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  scheduleDate: moment().format("YYYY-MM-DD"),
  unscheduledItems: [],
  // timelineHeaderTimeRange: {
  //   minTime: "08:00:00",
  //   maxTime: "20:00:00",
  // },
  showMorningTimeRange: true,
};

const timelineFilterSlice = createSlice({
  name: "timelineFilter",
  initialState,
  reducers: {
    setTimelineScheduleDate: (state, action) => {
      console.log("Going to set timeline date: ", action.payload);
      state.scheduleDate = action.payload;
    },
    setUnscheduledItems: (state, action) => {
      console.log("setting unscheduled items filter slice");
      state.unscheduledItems = action.payload;
    },
    toggleShowMorningTimeRange: (state, action) => {
      state.showMorningTimeRange = !state.showMorningTimeRange;
    },
  },
});

// Reducer ================================/
export default timelineFilterSlice.reducer;

// Action ==================================/
export const {
  setTimelineScheduleDate,
  setUnscheduledItems,
  toggleShowMorningTimeRange,
} = timelineFilterSlice.actions;

// Selectors ==============================/
export const getTimelineFilterScheduleDate = (state) =>
  state.timelineFilter.scheduleDate;
export const getUnscheduledItems = (state) =>
  state.timelineFilter.unscheduledItems;

export const getShowMorningTimeRange = (state) =>
  state.timelineFilter.showMorningTimeRange;
