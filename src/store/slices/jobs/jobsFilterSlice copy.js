// jobFilterSlice.js

import { createSlice } from "@reduxjs/toolkit";

const jobsFilterSlice = createSlice({
  name: "jobsFilter",
  initialState: {
    mainFilter: "pending",
    subFilters: [],
    dropdownFilter: "", // for mailsent, customercreated, etc
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

      {
        id: 8,
        title: "Deleted",
        count: 0,
        name: "deleted",
        isChecked: false,
        textColour: "white",
        bgColour: "gray",
      },
    ],
    additionaFilters: {
      paymentVerified: [],
      paymentStatus: [],
      mailSentStatus: [],
      accountCreatedStatus: [],
    },
  },

  reducers: {
    setFilter: (state, action) => {
      state.mainFilter = action.payload;
    },
    addSubFilter: (state, action) => {
      state.subFilters.push(action.payload);
    },
    removeSubFilter: (state, action) => {
      state.subFilters = state.subFilters.filter(
        (item) => item !== action.payload
      );
      //   const actualArray = Array.from(state.subFilter);
      //   console.log("Actual array:", actualArray);
      //   //   console.log("Inside removefilter: ", state.subFilter);
    },
    toggleCheckbox: (state, action) => {
      const id = action.payload;
      console.log("Toggle Checkbox called for name ", id);
      const checkbox = state.checkboxes.find((checkbox) => checkbox.id === id);
      if (checkbox) {
        checkbox.isChecked = !checkbox.isChecked;
      }
      if (checkbox.isChecked && checkbox.name !== "all") {
        if (!state.subFilters.includes(checkbox.name)) {
          state.subFilters.push(checkbox.name);
        }
      } else {
        state.subFilters = state.subFilters.filter(
          (item) => item !== checkbox.name
        );
      }
    },

    toggleAllCheckboxes: (state, action) => {
      //   const allChecked = action.payload;
      const allSubFilters = [
        "unassigned",
        "scheduled",
        "inprogress",
        "demo",
        "onhold",
        "assigned",
        "deleted",
      ];
      state.checkboxes[0].isChecked = !state.checkboxes[0].isChecked;
      let allCheckedState = state.checkboxes[0].isChecked;

      state.checkboxes.map((checkbox) => {
        checkbox.isChecked = allCheckedState;
      });

      if (allCheckedState) {
        state.subFilters = allSubFilters;
      } else {
        state.subFilters = [];
      }
    },

    setDropdownFilter: (state, action) => {
      state.dropdownFilter = action.payload;
    },

    setSearchTextFilter: (state, action) => {
      state.searchTextFilter = action.payload;
    },

    setCheckboxCounts: (state, action) => {
      const {
        unassignedCount,
        scheduledCount,
        assignedCount,
        inprogressCount,
        demoCount,
        onholdCount,
        deletedCount,
      } = action.payload;
      state.checkboxes[0].count =
        unassignedCount +
        scheduledCount +
        assignedCount +
        inprogressCount +
        demoCount +
        onholdCount +
        deletedCount;
      state.checkboxes[1].count = unassignedCount;
      state.checkboxes[2].count = scheduledCount;
      state.checkboxes[3].count = assignedCount;
      state.checkboxes[4].count = inprogressCount;
      state.checkboxes[5].count = demoCount;
      state.checkboxes[6].count = onholdCount;
      state.checkboxes[7].count = deletedCount;

      // state.checkboxes.forEach((checkbox) => {
      //   switch (checkbox.name) {
      //     case "unassigned": {
      //       checkbox.count = unassignedCount;
      //       console.log("Unassigned count in state file is ", unassignedCount);
      //     }
      //     case "scheduled": {
      //       checkbox.count = scheduledCount;
      //     }
      //     case "assigned": {
      //       checkbox.count = assignedCount;
      //     }
      //     case "inprogress": {
      //       checkbox.count = inprogressCount;
      //     }
      //     case "demo": {
      //       checkbox.count = demoCount;
      //     }
      //     case "onhold": {
      //       checkbox.count = onholdCount;
      //     }
      //     case "deleted": {
      //       checkbox.count = deletedCount;
      //     }
      //   }
      // });
    },

    setPaymentVerifiedFilters: (state, action) => {
      const { isChecked, filter } = action.payload;
      if (isChecked) {
        state.additionalFilters.paymentVerified.push(action.payload);
      } else {
        state.additionalFilters.paymentVerified =
          state.additionalFilters.paymentVerified.filter(
            (item) => item !== filter
          );
      }
    },

    setPaymentStatusFilters: (state, action) => {},

    setMailSentStatusFilters: (state, action) => {},

    setAccountCreatedStatusFilters: (state, action) => {},
  },

  // ... other reducers for handling loading and errors
});

export const {
  setFilter,
  addSubFilter,
  removeSubFilter,
  toggleCheckbox,
  toggleAllCheckboxes,
  setDropdownFilter,
  setSearchTextFilter,
  setCheckboxCounts,
  setPaymentVerifiedFilters,
  setPaymentStatusFilters,
  setMailSentStatusFilters,
  setAccountCreatedStatusFilters,
} = jobsFilterSlice.actions;

export default jobsFilterSlice.reducer;
