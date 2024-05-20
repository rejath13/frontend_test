import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

// Initial State =========================================== /
const initialState = {
  jobId: null,
  salesPlusId: null,
  companyName: null,
  contactName: null,
  contactPhone: null,
  scheduleDate: moment().toISOString(),
  fromTime: "",
  duration: null,
  toTime: "",
  technicianId: 1,
  schedQtyNew: null,
  schedQtyMigrate: "",
  schedQtyTrading: "",
  schedQtyService: "",
  schedQtyOthers: "",
  isHighPriority: false,
  isSentToTechnician: false,
  commentAdmin: "",
  location: null,
  coordinates: "",
};

// schedulerForm Slice ========================================== /
const schedulerFormSlice = createSlice({
  name: "schedulerForm",
  initialState,
  reducers: {
    setJobInfo: (state, action) => {
      const {
        jobId,
        salesPlusId,
        companyName,
        contactName,
        contactPhone,
        schedQtyNew,
        schedQtyService,
        schedQtyMigrate,
        schedQtyTrading,
      } = action.payload;
      state.jobId = jobId;
      state.salesPlusId = salesPlusId ?? "";
      state.companyName = companyName ?? "";
      state.contactName = contactName ?? "";
      state.contactPhone = contactPhone ?? "";
      state.schedQtyNew = schedQtyNew ?? "";
      state.schedQtyService = schedQtyService ?? "";
      state.schedQtyMigrate = schedQtyMigrate ?? "";
      state.schedQtyTrading = schedQtyTrading ?? "";
    },

    setScheduleContactInfo: (state, action) => {
      const infos = action.payload;
      Object.keys(infos).forEach((key) => {
        state[key] = infos[key];
      });
    },
    setScheduleDate: (state, action) => {
      state.scheduleDate = action.payload;
    },
    setFromTime: (state, action) => {
      state.fromTime = action.payload;
    },
    setToTime: (state, action) => {
      state.toTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setTechnician: (state, action) => {
      state.technicianId = action.payload;
    },
    setSchedQuantities: (state, action) => {
      const qty = action.payload;
      Object.keys(qty).forEach((key) => {
        state[key] = qty[key];
      });
    },
    toggleIsHighPriority: (state, action) => {
      state.isHighPriority = !state.isHighPriority;
    },
    toggleIsSentToTechnician: (state, action) => {
      state.isSentToTechnician = !state.isSentToTechnician;
    },
    setScheduleAdminComment: (state, action) => {
      state.commentAdmin = action.payload;
    },
    setGeoData: (state, action) => {
      const { location, coordinates } = action.payload;
      state.location = location;
      state.coordinates = coordinates;
    },
  },
});

// Actions ======================================== /
export const {
  setJobInfo,
  setScheduleContactInfo,
  setScheduleDate,
  setFromTime,
  setToTime,
  setDuration,
  setTechnician,
  setSchedQuantities,
  toggleIsHighPriority,
  toggleIsSentToTechnician,
  setScheduleAdminComment,
  setGeoData,
} = schedulerFormSlice.actions;

// Selectors ====================================== /
const selectors = {
  getScheduleDate: (state) => state.schedulerForm.scheduleDate,
  getFromTime: (state) => state.schedulerForm.fromTime,
  getToTime: (state) => state.schedulerForm.toTime,
  getDuration: (state) => state.schedulerForm.duration,
  getTimes: (state) => ({
    fromTime: state.schedulerForm.fromTime,
    toTime: state.schedulerForm.toTime,
    duration: state.schedulerForm.duration,
  }),
  getGeoData: (state) => ({
    location: state.schedulerForm.location,
    coordinates: state.schedulerForm.coordinates,
  }),
  getSchedQuantities: (state) => ({
    schedQtyNew: state.schedulerForm.schedQtyNew,
    schedQtyMigrate: state.schedulerForm.schedQtyMigrate,
    schedQtyTrading: state.schedulerForm.schedQtyTrading,
    schedQtyService: state.schedulerForm.schedQtyService,
    schedQtyOthers: state.schedulerForm.schedQtyOthers,
  }),
  getTechnicianId: (state) => state.schedulerForm.technicianId,
  getIsHighPriority: (state) => state.schedulerForm.isHighPriority,
  getScheduleAdminComment: (state) => state.schedulerForm.commentAdmin,
  getJobInfo: (state) => ({
    jobId: state.schedulerForm.jobId,
    salesPlusId: state.schedulerForm.salesPlusId,
    companyName: state.schedulerForm.companyName,
    contactName: state.schedulerForm.contactName,
    contactPhone: state.schedulerForm.contactPhone,
  }),
  getScheduleContactInfo: (state) => ({
    contactName: state.schedulerForm.contactName,
    contactPhone: state.schedulerForm.contactPhone,
  }),
  getIsSentToTechnician: (state) => state.schedulerForm.isSentToTechnician,
};

// Export Selectors ============================================ /
export const {
  getJobInfo,
  getScheduleContactInfo,
  getScheduleDate,
  getFromTime,
  getToTime,
  getDuration,
  getTimes,
  getGeoData,
  getSchedQuantities,
  getTechnicianId,
  getIsHighPriority,
  getIsSentToTechnician,
  getScheduleAdminComment,
} = selectors;

// Export Reducer ================================================ /
export default schedulerFormSlice.reducer;
