// jobFilterSlice.js

import { createSlice, isActionCreator } from "@reduxjs/toolkit";

const additionalFiltersInitialState = {
  additionalFiltersCount: 0,

  paymentVerifiedFilters: {
    paid: false,
    notPaid: false,
  },
  paymentStatusFilters: {
    paid: false,
    notPaid: false,
    partial: false,
  },
  mailSentStatusFilters: {
    sent: false,
    notSent: false,
  },
  accountCreatedStatusFilters: {
    created: false,
    notCreated: false,
  },
  deletedStatusFilters: {
    deleted: false,
  },
  salesPersonFilters: null,
  implementationTypeFilters: null,
  jobStatusFilters: null,
};

const initialState = {
  mainFilter: "pending", // for showing all 'pending' jobs initially
  searchTextFilter: "",
  checkboxes: [
    {
      id: 1,
      title: "All",
      count: 0,
      name: "all",
      isChecked: false,
      textColour: "black",
      bgColour: "white",
    },
    {
      id: 2,
      title: "Un Assigned",
      count: 0,
      name: "unassigned",
      isChecked: true,
      textColour: "white",
      bgColour: "red",
    },
    {
      id: 3,
      title: "Scheduled",
      count: 0,
      name: "scheduled",
      isChecked: true,
      textColour: "white",
      bgColour: "orange",
    },
    {
      id: 4,
      title: "Assigned",
      count: 0,
      name: "assigned",
      isChecked: false,
      textColour: "white",
      bgColour: "pink",
    },
    {
      id: 5,
      title: "In Progress",
      count: 0,
      name: "inprogress",
      isChecked: true,
      textColour: "white",
      bgColour: "indigo",
    },
    {
      id: 6,
      title: "Demo",
      count: 0,
      name: "demo",
      isChecked: false,
      textColour: "white",
      bgColour: "purple",
    },
    {
      id: 7,
      title: "On Hold",
      count: 0,
      name: "onhold",
      isChecked: false,
      textColour: "black",
      bgColour: "yellow",
    },

    // {
    //   id: 8,
    //   title: "Deleted",
    //   count: 0,
    //   name: "deleted",
    //   isChecked: false,
    //   textColour: "white",
    //   bgColour: "gray",
    // },
  ],

  ...additionalFiltersInitialState,
};

const jobsFilterSlice = createSlice({
  name: "jobsFilter",

  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.mainFilter = action.payload;
    },

    toggleCheckbox: (state, action) => {
      const id = action.payload;
      console.log("Toggle Checkbox called for name ", id);
      const checkbox = state.checkboxes.find((checkbox) => checkbox.id === id);
      if (checkbox?.id === 1) {
        // for 'All' Checkbox
        if (checkbox?.isChecked) {
          state.checkboxes.map((checkbox) => (checkbox.isChecked = false));
        } else {
          state.checkboxes.map((checkbox) => (checkbox.isChecked = true));
        }
      } else {
        checkbox.isChecked = !checkbox.isChecked;
      }
    },

    selectAllCheckboxes: (state) => {
      state.checkboxes.map((checkbox) => (checkbox.isChecked = true));
    },

    disableOtherCheckboxes: (state, action) => {
      // console.log("Inside disableOtherCheckboxes");
      const id = action.payload;
      // console.log("id from jobfilter is ", id);
      const selectedCheckbox = state.checkboxes.find(
        (checkbox) => checkbox.id === id
      );
      // console.log("Selected Checkbox is ", selectedCheckbox);
      selectedCheckbox.isChecked = true;
      // console.log(
      //   `selected state for checkbox ${id} is ${selectedCheckbox.isChecked}`
      // );
      if (selectedCheckbox.isChecked) {
        const otherCheckboxes = state.checkboxes.filter(
          (checkbox) => checkbox.id !== id
        );
        otherCheckboxes.map((checkbox) => {
          checkbox.isChecked = false;
        });
      } else {
        selectedCheckbox.isChecked = false;
      }
    },

    setSearchTextFilter: (state, action) => {
      state.searchTextFilter = action.payload;
    },

    togglePaymentVerifiedFilters: (state, action) => {
      state.paymentVerifiedFilters[action.payload] =
        !state.paymentVerifiedFilters[action.payload];

      // Increase or decrease the additional filters badge count value based on checked or unchecked
      state.paymentVerifiedFilters[action.payload]
        ? (state.additionalFiltersCount += 1)
        : (state.additionalFiltersCount -= 1);
    },
    togglePaymentStatusFilters: (state, action) => {
      // console.log("Action for payment status : ", action);
      state.paymentStatusFilters[action.payload] =
        !state.paymentStatusFilters[action.payload];

      // Increase or decrease the additional filters badge count value based on checked or unchecked
      state.paymentStatusFilters[action.payload]
        ? (state.additionalFiltersCount += 1)
        : (state.additionalFiltersCount -= 1);
    },

    toggleMailSentStatusFilters: (state, action) => {
      state.mailSentStatusFilters[action.payload] =
        !state.mailSentStatusFilters[action.payload];

      // Increase or decrease the additional filters badge count value based on checked or unchecked
      state.mailSentStatusFilters[action.payload]
        ? (state.additionalFiltersCount += 1)
        : (state.additionalFiltersCount -= 1);
    },
    toggleAccountCreatedStatusFilters: (state, action) => {
      state.accountCreatedStatusFilters[action.payload] =
        !state.accountCreatedStatusFilters[action.payload];
      // Increase or decrease the additional filters badge count value based on checked or unchecked
      state.accountCreatedStatusFilters[action.payload]
        ? (state.additionalFiltersCount += 1)
        : (state.additionalFiltersCount -= 1);
    },
    toggleDeletedStatusFilters: (state, action) => {
      state.deletedStatusFilters[action.payload] =
        !state.deletedStatusFilters[action.payload];
      // Increase or decrease the additional filters badge count value based on checked or unchecked
      state.deletedStatusFilters[action.payload]
        ? (state.additionalFiltersCount += 1)
        : (state.additionalFiltersCount -= 1);
    },
    setSalesPersonFilters: (state, action) => {
      if (action.payload) {
        state.salesPersonFilters = parseInt(action.payload);
        state.additionalFiltersCount += 1;
      } else {
        state.additionalFiltersCount -= 1;
      }
    },
    setImplementationTypeFilters: (state, action) => {
      if (action.payload) {
        state.implementationTypeFilters = action.payload;
        state.additionalFiltersCount += 1;
      } else {
        state.additionalFiltersCount -= 1;
      }
    },
    setJobStatusFilters: (state, action) => {
      if (action.payload) {
        state.jobStatusFilters = action.payload;
        state.additionalFiltersCount += 1;
      } else {
        state.additionalFiltersCount -= 1;
      }
    },

    resetFilters: (state) => {
      state.additionalFiltersCount = 0;
      state.paymentVerifiedFilters =
        additionalFiltersInitialState.paymentVerifiedFilters;
      state.paymentStatusFilters =
        additionalFiltersInitialState.paymentStatusFilters;
      state.mailSentStatusFilters =
        additionalFiltersInitialState.mailSentStatusFilters;
      state.accountCreatedStatusFilters =
        additionalFiltersInitialState.accountCreatedStatusFilters;
      state.deletedStatusFilters =
        additionalFiltersInitialState.deletedStatusFilters;
      state.salesPersonFilters =
        additionalFiltersInitialState.salesPersonFilters;
      state.implementationTypeFilters =
        additionalFiltersInitialState.implementationTypeFilters;
      state.jobStatusFilters = additionalFiltersInitialState.jobStatusFilters;
    },
  },

  // ... other reducers for handling loading and errors
});

export const {
  setFilter,
  setSearchTextFilter,
  toggleCheckbox,
  togglePaymentVerifiedFilters,
  togglePaymentStatusFilters,
  toggleMailSentStatusFilters,
  toggleAccountCreatedStatusFilters,
  toggleDeletedStatusFilters,
  disableOtherCheckboxes,
  setSalesPersonFilters,
  resetFilters,
  setImplementationTypeFilters,
  setJobStatusFilters,
  selectAllCheckboxes,
} = jobsFilterSlice.actions;

export default jobsFilterSlice.reducer;
