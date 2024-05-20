import { createApi } from "@reduxjs/toolkit/query/react";
import { transformData, calculateCounts } from "./helperJobsApi";
import { baseQuery } from "../apiConfig";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery, // imported from apiConfig
  tagTypes: [
    "fetchJobs",
    "fetchSortOrders",
    "status-last-updated",
    "db-sort-order",
  ],
  endpoints: (builder) => ({
    fetchJobs: builder.query({
      providesTags: ["fetchJobs"],
      query: () => "jobs", // Replace with your API endpoint

      transformResponse: (data, meta, filters) => {
        calculateCounts(data);
        return transformData(data, filters);
      },
    }),

    setExpectedCompletionDate: builder.mutation({
      invalidatesTags: ["fetchJobs"],
      query: (dataToUpdate) => ({
        url: `jobs/expected-completion-date/update`,
        method: "POST",
        body: dataToUpdate,
      }),
    }),
    setPaymentVerifiedStatus: builder.mutation({
      invalidatesTags: ["fetchJobs", "status-last-updated"],
      query: (dataToUpdate) => ({
        url: `jobs/payment-verified-status/update`,
        method: "POST",
        body: dataToUpdate,
      }),
    }),
    setPaymentStatus: builder.mutation({
      invalidatesTags: ["fetchJobs", "status-last-updated"],
      query: (dataToUpdate) => ({
        url: `jobs/payment-status/update`,
        method: "POST",
        body: dataToUpdate,
      }),
    }),
    setCustomerStatus: builder.mutation({
      invalidatesTags: ["fetchJobs"],
      query: (dataToUpdate) => ({
        url: `jobs/customer-status/update`,
        method: "POST",
        body: dataToUpdate,
      }),
    }),
    deleteJob: builder.mutation({
      invalidatesTags: ["fetchJobs"],
      query: (dataToUpdate) => ({
        url: `jobs/job/delete`,
        method: "POST",
        body: dataToUpdate,
      }),
    }),

    sendMail: builder.mutation({
      invalidatesTags: ["fetchJobs"],
      query: (mailData) => ({
        url: `jobs/job/send-mail`,
        method: "POST",
        body: mailData,
      }),
    }),
    getTraccarCredentials: builder.query({
      query: (traccarId) => ({
        url: `jobs/job/get-traccar-credentials/${traccarId}`,
      }),
    }),
    createTraccarUser: builder.mutation({
      invalidatesTags: ["fetchJobs"],
      query: (data) => ({
        url: `jobs/traccar-user/create`,
        method: "POST",
        body: data,
      }),
    }),
    updateStatusNote: builder.mutation({
      invalidatesTags: ["fetchJobs"],
      query: (data) => ({
        url: `jobs/status-note/update`,
        method: "POST",
        body: data,
      }),
    }),
    getSalesPersons: builder.query({
      query: () => ({ url: `sales-persons/`, method: "GET" }),
    }),

    getImplementationTypes: builder.query({
      query: () => ({ url: `jobs/job/implementation-types/` }),
    }),

    getSourceTypes: builder.query({
      query: () => ({ url: `jobs/job/source-types/` }),
    }),

    updateJob: builder.mutation({
      invalidatesTags: ["fetchJobs"],
      query: (data) => ({
        url: `jobs/job/update`,
        method: "POST",
        body: data,
      }),
    }),

    getLastUpdatedPaymentStatus: builder.query({
      providesTags: ["last-updated-payment-status"],
      query: (params) => ({
        url: `jobs/job/last-updated-payment-status?jobId=${params.jobId}&categoryName=paymentStatus`,
      }),
    }),
    getLastUpdatedPaymentVerifiedStatus: builder.query({
      providesTags: ["last-updated-payment-verified-status"],
      query: (params) => ({
        url: `jobs/job/last-updated-payment-verified-status?jobId=${params.jobId}&categoryName=paymentVerifiedStatus`,
      }),
    }),

    getStatusLastUpdatedBy: builder.query({
      providesTags: ["status-last-updated"],
      // invalidatesTags: ["fetchJobs"],
      query: (params) => ({
        url: `jobs/job/last-updated-by?jobId=${params.jobId}&categoryName=${params.categoryName}`,
      }),
    }),

    persistSortOrder: builder.mutation({
      invalidatesTags: ["db-sort-order"],
      query: ({ tempMappings }) => ({
        url: `jobs/persist-sort-order/update`,
        method: "POST",
        body: {
          sortedData: tempMappings,
        },
      }),
    }),

    getSortOrder: builder.query({
      providesTags: ["db-sort-order"],
      query: () => ({
        url: `jobs/sort-order/get`,
      }),
    }),

    getTechnicians: builder.query({
      query: () => ({
        url: `technicians/`,
      }),
    }),
  }),
});

export const {
  useFetchJobsQuery,
  useUpdateSortOrderMutation,
  useSetExpectedCompletionDateMutation,
  useSetPaymentVerifiedStatusMutation,
  useSetPaymentStatusMutation,
  useSetCustomerStatusMutation,
  useDeleteJobMutation,
  useSendMailMutation,
  useGetTraccarCredentialsQuery,
  useCreateTraccarUserMutation,
  useUpdateStatusNoteMutation,
  useGetSalesPersonsQuery,
  useGetImplementationTypesQuery,
  useGetSourceTypesQuery,
  useUpdateJobMutation,
  useGetStatusLastUpdatedByQuery,
  useGetLastUpdatedPaymentStatusQuery,
  useGetLastUpdatedPaymentVerifiedStatusQuery,
  usePersistSortOrderMutation,
  useGetSortOrderQuery,
  useGetTechniciansQuery,
  // useGetSortOrdersQuery,
} = jobsApi;
export default jobsApi;
