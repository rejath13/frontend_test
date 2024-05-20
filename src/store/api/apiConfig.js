// apiConfig.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const jobsEnv = process.env.REACT_APP_JOBS_ENV;
console.log("Environement is ", jobsEnv)

// need to change after env config
let baseUrl = '';
if (jobsEnv === 'production') {
  baseUrl = "http://85.195.96.47:6001/locator-admin/api/v1";
} 
if (jobsEnv === 'testing') {
  baseUrl = "http://65.20.71.81:6002/locator-admin/api/v1"
}
if (jobsEnv === 'development') {
  baseUrl = "http://localhost:6003/locator-admin/api/v1"
}

export const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
});
