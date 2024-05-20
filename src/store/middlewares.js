import jobsApi from "./api/jobs/jobsApi";
import localStorageMiddleware from "./localStorageMiddleware/localStorageMiddleware";

const middlewares = [
  jobsApi.middleware,
  localStorageMiddleware,
  // Add other middlewares here
];

export default middlewares;
