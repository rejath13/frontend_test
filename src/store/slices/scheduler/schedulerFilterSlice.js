import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  scheduleDate: moment().format("YYYY-MM-DD"),
  // scheduleDate: null,
  // checkboxes: [
  //   {
  //     id: 1,
  //     label: "Schedules",
  //     value: "schedules",
  //     bgColour: "gray",
  //     textColour: "white",
  //     isChecked: false,
  //   },
  //   {
  //     id: 2,
  //     label: "Assigned",
  //     value: "assigned",
  //     bgColour: "blue",
  //     textColour: "white",
  //     isChecked: false,
  //   },
  //   {
  //     id: 3,
  //     label: "Partial",
  //     value: "partial",
  //     bgColour: "orange",
  //     textColour: "white",
  //     isChecked: false,
  //   },
  //   {
  //     id: 4,
  //     label: "Completed",
  //     value: "completed",
  //     bgColour: "green",
  //     textColour: "white",
  //     isChecked: false,
  //   },
  // ],
  checkboxes: [
    {
      id: 1,
      label: "Unscheduled",
      value: "unscheduled",
      bgColour: "red",
      textColour: "white",
      isChecked: false,
    },
    {
      id: 2,
      label: "Scheduled",
      value: "scheduled",
      bgColour: "purple",
      textColour: "white",
      isChecked: false,
    },
    {
      id: 3,
      label: "Assigned",
      value: "assigned",
      bgColour: "blue",
      textColour: "white",
      isChecked: false,
    },
    {
      id: 4,
      label: "Partial",
      value: "partial",
      bgColour: "orange",
      textColour: "white",
      isChecked: false,
    },
    {
      id: 5,
      label: "Completed",
      value: "completed",
      bgColour: "green",
      textColour: "white",
      isChecked: false,
    },
  ],
  scheduleSearchboxStatus: false,
  scheduleSearchboxValue: "",
  technicianId: null,
  isHighPriority: false,
  allPendingFilter: false,
  appliedFilters: [],
};

const schedulerFilterSlice = createSlice({
  name: "schedulerFilter",
  initialState,
  reducers: {
    setScheduleDate: (state, action) => {
      if (state.allPendingFilter) {
        state.allPendingFilter = initialState.allPendingFilter;
        // state.checkboxes = initialState.checkboxes;
        // state.isHighPriority = initialState.isHighPriority;
        // state.technicianId = initialState.technicianId;
      }
      state.scheduleSearchboxValue = initialState.scheduleSearchboxValue;
      state.scheduleDate = action.payload;
    },
    disableOtherCheckboxes: (state, action) => {
      const checkboxes = JSON.parse(JSON.stringify(state.checkboxes));
      const newCheckboxes = checkboxes.map((checkbox) => {
        if (checkbox.id !== action.payload) {
          checkbox.isChecked = false;
        } else {
          checkbox.isChecked = true;
        }
        return checkbox;
      });
      state.checkboxes = newCheckboxes;
    },
    toggleCheckbox: (state, action) => {
      const checkboxes = JSON.parse(JSON.stringify(state.checkboxes));
      const newCheckboxes = checkboxes.map((checkbox) => {
        if (checkbox.id === action.payload) {
          checkbox.isChecked = !checkbox.isChecked;
        }
        return checkbox;
      });
      state.checkboxes = newCheckboxes;
    },
    setScheduleSearchboxValue: (state, action) => {
      state.allPendingFilter = false;
      if (action.payload) {
        state.scheduleDate = null;
      } else {
        state.scheduleDate = initialState.scheduleDate;
        // // state.checkboxes = initialState.checkboxes;
        // state.technicianId = initialState.technicianId;
        // state.isHighPriority = initialState.isHighPriority;
        // state.allPendingFilter = initialState.allPendingFilter;
      }

      state.scheduleSearchboxValue = action.payload;
    },
    setTechnicianFilter: (state, action) => {
      state.technicianId = action.payload;
    },
    resetScheduleFilters: (state) => {
      return initialState;
    },
    toggleScheduleFilterPriority: (state) => {
      state.isHighPriority = !state.isHighPriority;
    },
    toggleScheduleFiltersAllPending: (state) => {
      state.scheduleSearchboxValue = "";
      state.allPendingFilter = !state.allPendingFilter;
      if (!state.allPendingFilter) {
        state.scheduleDate = initialState.scheduleDate;
      } else {
        state.scheduleDate = null;
      }
      // state.checkboxes = initialState.checkboxes;
      // state.technicianId = initialState.technicianId;
      // state.isHighPriority = initialState.isHighPriority;
      // state.scheduleSearchboxValue = initialState.scheduleSearchboxValue;
    },
  },
});

// Reducer ================================/
export default schedulerFilterSlice.reducer;

// Action ==================================/
export const {
  setScheduleDate,
  disableOtherCheckboxes,
  toggleCheckbox,
  setScheduleSearchboxValue,
  setTechnicianFilter,
  resetScheduleFilters,
  toggleScheduleFilterPriority,
  toggleScheduleFiltersAllPending,
} = schedulerFilterSlice.actions;

// Selectors ==============================/
export const getSchedulerFilterScheduleDate = (state) =>
  state.schedulerFilter.scheduleDate;

export const getScheduleFilterCheckboxes = (state) =>
  state.schedulerFilter.checkboxes;

export const getScheduleFiltersStatusArray = (state) => {
  const checkboxes = JSON.parse(
    JSON.stringify(state.schedulerFilter.checkboxes)
  );
  let statusArray = [];
  checkboxes.map((checkbox) =>
    checkbox.isChecked ? statusArray.push(checkbox.value) : ""
  );
  return statusArray;
};

export const getScheduleFilterSearchboxValue = (state) =>
  state.schedulerFilter.scheduleSearchboxValue;

export const getTechnicianFilter = (state) =>
  state.schedulerFilter.technicianId;

export const getScheduleFilterPriority = (state) =>
  state.schedulerFilter.isHighPriority;
export const getScheduleFiltersAllPendingStatus = (state) =>
  state.schedulerFilter.allPendingFilter;

export const getScheduleAppliedFilters = (state) => {
  let currentState = state.schedulerFilter;
  let appliedFilters = [];
  const {
    scheduleDate,
    checkboxes,
    scheduleSearchboxValue,
    technicianId,
    isHighPriority,
    allPendingFilter,
  } = currentState;

  if (scheduleDate) appliedFilters[0] = "Date";

  const appliedCheckboxCount = checkboxes.filter(
    (item) => item.isChecked
  ).length;
  // console.log("AppliedFilters: ", appliedFilters);
  // console.log("AppliedCheckbox Count: ", appliedCheckboxCount);

  if (appliedCheckboxCount > 0) appliedFilters[1] = "Schedule Status";
  if (technicianId) appliedFilters[2] = "Technician";
  if (isHighPriority) appliedFilters[3] = "Priority";
  if (allPendingFilter) appliedFilters[0] = "All Pending";
  if (scheduleSearchboxValue) appliedFilters[0] = "Search Box";

  return appliedFilters;
};
