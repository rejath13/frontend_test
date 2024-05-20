// modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  componentKey: null,
  size: "lg",
  title: "Modal Title",
  data: {},
};

const modalSlice = createSlice({
  name: "jobsModal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      // console.log(action.payload);
      const { componentKey, size, title, data } = action.payload;
      state.show = true;
      state.componentKey = componentKey;
      state.size = size;
      state.title = title;
      if (data) {
        state.data = { ...data };
      }
    },
    closeModal: (state) => {
      state.show = false;
      state.componentKey = null;
      state.title = "Modal Title";
      state.data = {};
      state.size = "lg";
    },
  },
});

// Actions
export const { openModal, closeModal } = modalSlice.actions;

// Selectors
export const getCurrentJobId = (state) => state.jobsModal.data?.jobId;
export const getCurrentScheduleData = (state) => state.jobsModal.data?.schedule;

// Reducer
export default modalSlice.reducer;
