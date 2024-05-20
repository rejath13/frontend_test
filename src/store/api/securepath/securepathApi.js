import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../apiConfig";

// import {
//   transformData,
//   calculateScheduleStatusCounts,
// } from "./helperSchedulerApi";

export const securepathApi = createApi({
  reducerPath: "securepathapi",
  baseQuery,
  // tagTypes: ['securepath-details'],
  //   tagTypes: ["fetch-secure-path-details"],
  endpoints: (builder) => ({
    fetchSecurepath: builder.query({
      providesTags: ["securepath"],
      query: (filters) => ({
        url: `secure-path`,
        method: "GET",
        // params: filters,
      }),
      transformResponse: (data, meta, filters) => {
        // console.log("initial data: ", data);
        return data.data;
      },
    }),
    createsecurepath:builder.mutation({
      invalidatesTags:["securepath"],
      query: (data) => ({
        url: `secure-path/create`,
        method: 'POST',
        body: data
      }),
    }),
    fetchcategory:builder.query({
      query:(data)=>({
        url:`secure-path/category`,
        method:"GET"
      }),
      transformResponse:(data,meta,filters)=>{
        return data.data
      }
    }),
    updatesecurepath:builder.mutation({
      invalidatesTags:["securepath"],
      query: (data) => ({
        url: `secure-path/update`,
        method: 'POST',
        body: data
      }),
    }),
    fetchvehicles:builder.query({
      providesTags: ["securepath-vehicles"],
      query: (filters) => ({
        url: `secure-path/vehicles`,
        method: "GET",
        // params: filters,
      }),
      transformResponse: (data, meta, filters) => {
        // console.log("initial data: ", data);
        return data.data;
      },
    }),
    updatevehicles:builder.mutation({
      invalidatesTags:["securepath-vehicles"],
      query: (data) => ({
        url: `secure-path/vehicles`,
        method: 'POST',
        body: data
      }),
    }),
    fetchcompany:builder.query({
      query:(data)=>({
        url:`secure-path/company_name`,
        method:"GET"
      }),
      transformResponse:(data,meta,filters)=>{
        return data.data
      }
    }),
    createvehicles:builder.mutation({
      invalidatesTags:["securepath-vehicles"],
      query: (data) => ({
        url: `secure-path/createvehicle`,
        method: 'POST',
        body: data
      }),
    }),


  }),
});

export const { 
  useFetchSecurepathQuery ,
  useCreatesecurepathMutation,
  useFetchcategoryQuery,
  useUpdatesecurepathMutation,
  useFetchvehiclesQuery,
  useUpdatevehiclesMutation,
  useFetchcompanyQuery,
  useCreatevehiclesMutation

} = securepathApi;

export default securepathApi;
