// jobsModalSlice.js

import { createSlice } from "@reduxjs/toolkit";

const jobsModalSlice = createSlice({
  name: "jobsModal",
  initialState: {
    additionalFiltersModal: {
      show: false,
    },
    modalDeleteStatus: {
      show: false,
    },
  },
  reducers: {
    setAdditionalFiltersModal: (state) => {
      state.additionalFiltersModal.show = !state.additionalFiltersModal.show;
    },

    setModalDeleteStatus: (state) => {
      state.modalDeleteStatus.show = !state.modalDeleteStatus.show;
    },
  },
});

export const { setAdditionalFiltersModal, setModalDeleteStatus } =
  jobsModalSlice.actions;

export default jobsModalSlice.reducer;
