import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../apiConfig";
import {
  transformData,
  calculateScheduleStatusCounts,
} from "./helperSchedulerApi";
import moment from 'moment';

export const schedulerApi = createApi({
  reducerPath: "schedulerApi",
  baseQuery,
  tagTypes: ["fetchSchedules", "fetchTimelineSchedules"],
  endpoints: (builder) => ({
    fetchSchedules: builder.query({
      providesTags: ["fetchSchedules"],
      query: (filters) => ({
        url: `schedules`,
        method: "GET",
        params: filters,
      }), // Replace with your API endpoint
      transformResponse: (data, meta, filters) => {
        // console.log("initial data: ", data);
        return transformData(data, filters);
      },
    }),

    fetchTimelineSchedules: builder.query({
      providesTags: ["fetchTimelineSchedules"],
      query: (timelineFilters) => ({
        url: `schedules/timeline-schedules`,
        method: "GET",
        params: timelineFilters,
      }),
    }),
    createSchedule: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => {
        console.log('Create Schedule data: ', data)
        return ({
        url: `schedules/create`,
        method: "POST",
        body: data,
      })
    }
    }),
    getGoogleLocationSuggestions: builder.query({
      query: (params) =>
        `google-maps/location-suggestions?inputLocation=${params.inputLocation}`,
    }),
    toggleSchedulePriority: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/toggle-schedule-priority`,
        method: "POST",
        body: data,
      }),
    }),
    
    updateScheduleData: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => {
        const {fromTime} = data;
        // console.log('converted to utc: ', moment.utc(fromTime).format())

        // console.log('Info data in scheduler api: ', data)
        return {
          url: `schedules/update-schedule-data`,
          method: "POST",
          body: data,
        }
      }
    }),
    updateTimezoneFixerData: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => {
        console.log('Info data in fixer api: ', data)
        return {
          url: `schedules/timezone-fixer`,
          method: "POST",
          body: data,
        }
      }
    }),
    updateScheduleTiming: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => {
        console.log('Update Schedule data: ', data)
        return ({
        url: `schedules/update-schedule-timing`,
        method: "POST",
        body: data,
      })
    }
    }),
    updateScheduleTechnician: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-schedule-technician`,
        method: "POST",
        body: data,
      }),
    }),
    updateTimelineTechnician: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-timeline-technician`,
        method: "POST",
        body: data,
      }),
    }),

    updateScheduleQty: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-schedule-qty`,
        method: "POST",
        body: data,
      }),
    }),
    updateScheduleLocation: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-schedule-location`,
        method: "POST",
        body: data,
      }),
    }),
    updateScheduleStatus: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-schedule-status`,
        method: "POST",
        body: data,
      }),
    }),
    updateScheduleTrainedStatus: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-schedule-trained-status`,
        method: "POST",
        body: data,
      }),
    }),
    updateSchedulePaymentStatus: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-schedule-payment-status`,
        method: "POST",
        body: data,
      }),
    }),
    updateScheduleAdminComment: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-schedule-admin-comment`,
        method: "POST",
        body: data,
      }),
    }),
    updateScheduleContactInfo: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/update-schedule-contact-info`,
        method: "POST",
        body: data,
      }),
    }),
    repeatSchedule: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/repeat-schedule`,
        method: "POST",
        body: data,
      }),
    }),
    sendScheduleToTechnician: builder.mutation({
      invalidatesTags: ["fetchSchedules", "fetchTimelineSchedules"],
      query: (data) => ({
        url: `schedules/send-schedule-to-technician`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchSchedulesQuery,
  useFetchTimelineSchedulesQuery,
  useCreateScheduleMutation,
  useGetGoogleLocationSuggestionsQuery,
  useToggleSchedulePriorityMutation,
  useUpdateScheduleDataMutation,
  useUpdateScheduleTimingMutation,
  useUpdateScheduleTechnicianMutation,
  useUpdateScheduleQtyMutation,
  useUpdateScheduleLocationMutation,
  useUpdateScheduleStatusMutation,
  useUpdateScheduleTrainedStatusMutation,
  useUpdateSchedulePaymentStatusMutation,
  useUpdateScheduleAdminCommentMutation,
  useUpdateScheduleContactInfoMutation,
  useRepeatScheduleMutation,
  useUpdateTimelineTechnicianMutation,
  useSendScheduleToTechnicianMutation,
  useUpdateTimezoneFixerDataMutation,
} = schedulerApi;
export default schedulerApi;
