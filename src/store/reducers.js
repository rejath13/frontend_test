import { combineReducers } from "@reduxjs/toolkit";
import { reducer as formReducer } from "redux-form";
// import schedulerApi from "./api/scheduler/schedulerApi";

// import schedulerMainNavReducer from "./slices/scheduler/schedulerMainNavSlice";

const reducers = combineReducers({
  form: formReducer,

  // [schedulerApi.reducerPath]: schedulerApi.reducer,
  // schedulerMainNav: schedulerMainNavReducer,
});

export default reducers;
