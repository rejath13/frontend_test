// schedulerMainNavSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  // {
  //   id: 1,
  //   link: "To Schedule",
  //   isActive: true,
  // },
  {
    id: 2,
    link: "schedules",
    isActive: true,
  },
  {
    id: 3,
    link: "timeline",
    isActive: false,
  },
];

const schedulerMainNavSlice = createSlice({
  name: "schedulerMainNav",
  initialState,
  reducers: {
    updateSchedulerMainNav: (state, action) => {
      const clickedId = action.payload;
      state = state?.map((item) => {
        if (item.id === clickedId) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
        return item;
      });
      //   console.log(
      //     "Scheduler main nav state: ",
      //     JSON.parse(JSON.stringify(state))
      //   );
    },
  },
});

export const selectCurrentMainNav = (state) => {
  const schedulerMainNav = state.schedulerMainNav;
  // console.log("schedulerMainNav in selector is ", schedulerMainNav);
  return schedulerMainNav
    ? schedulerMainNav.find((item) => item.isActive)
    : null;
};

export const getTimelineActiveStatus = (state) => {
  const schedulerMainNav = state.schedulerMainNav;
  // console.log("schedulerMainNav in timeline selector is ", schedulerMainNav);
  return schedulerMainNav
    ? schedulerMainNav?.find((item) => item.link === "timeline").isActive
    : null;
};

export const selectMainNavTabs = (state) => state.schedulerMainNav;

export const { updateSchedulerMainNav, sayHello } =
  schedulerMainNavSlice.actions;

export default schedulerMainNavSlice.reducer;
