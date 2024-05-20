import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import reducers from "./reducers";

// Jobs
import jobsApi from "./api/jobs/jobsApi";
import jobsFilterReducer from "./slices/jobs/jobsFilterSlice";
import jobsCountReducer from "./slices/jobs/jobsCountSlice";
import jobsModalReducer from "./slices/jobs/jobsModalSlice";
import jobsReducer from "./slices/jobs/jobSlice";

// Scheduler
import schedulerApi from "./api/scheduler/schedulerApi";
import schedulerMainNavReducer from "./slices/scheduler/schedulerMainNavSlice";
import schedulerFormReducer from "./slices/scheduler/schedulerFormSlice";
import schedulerFilterReducer from "./slices/scheduler/schedulerFilterSlice";
import schedulerCountReducer from "./slices/scheduler/scheduleCountSlice";
import timelineFilterReducer from "./slices/scheduler/timelineFilterSlice";

import schedulerReducers from "./schedulerReducers";
import googleMapReducer from "./slices/google-maps/googleMapSlice";
import securepathApi from "./api/securepath/securepathApi";
import vehiclepageReducer from './slices/securepath/SecureVehicle.slice'
// payments by rishikesh
import paymentApi from "./api/payments/paymentApi";

// import sessionStorageMiddleware from "./localStorageMiddleware/localStorageMiddleware";

const apiMiddlewares = [
  jobsApi.middleware, 
  schedulerApi.middleware,
  securepathApi.middleware,
  paymentApi.middleware
];


// Get local storage stored state
// const storedState =
//   JSON.parse(localStorage.getItem("redux-scheduler-main-nav")) || {};
// console.log("Store state schedule main nav is ", storedState);
// console.log("Hi from store");

// function loadStateFromSessionStorage() {
//   try {
//     const serializedState = sessionStorage.getItem("redux-scheduler-main-nav");
//     return serializedState ? JSON.parse(serializedState) : undefined;
//   } catch (err) {
//     console.error("Error loading state from sessionStorage:", err);
//     return undefined;
//   }
// }

const store = configureStore({
  reducer: {
    // Jobs Module Reducers ===========================
    [jobsApi.reducerPath]: jobsApi.reducer,
    jobsFilter: jobsFilterReducer,
    jobsCount: jobsCountReducer,
    jobsModal: jobsModalReducer,
    jobs: jobsReducer,

    //Scheduler ===========================
    [schedulerApi.reducerPath]: schedulerApi.reducer,
    schedulerMainNav: schedulerMainNavReducer,
    schedulerForm: schedulerFormReducer,
    schedulerFilter: schedulerFilterReducer,
    schedulerCount: schedulerCountReducer,
    timelineFilter: timelineFilterReducer,


     // payments by rishikesh ========================
     [paymentApi.reducerPath]:paymentApi.reducer,

    //securepath ===================================
    [securepathApi.reducerPath]: securepathApi.reducer,
    vehiclepage:vehiclepageReducer,


    // Google Maps ============================
    googleMap: googleMapReducer,
    // scheduler: schedulerReducers,
    // pagination: paginationReducer,

    // Other Reducers =======================
    reducers, // Imported from reducers.js
  },
  // preloadedState: {
  //   schedulerMainNav: loadStateFromSessionStorage(),
  // },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(sessionStorageMiddleware, apiMiddlewares),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddlewares),

  devTools: true,
});

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

export default store;
