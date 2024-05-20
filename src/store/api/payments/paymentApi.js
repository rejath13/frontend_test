import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../apiConfig";

const paymentApi = createApi({
  reducerPath: "paymentapi",
  baseQuery,
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({ filter, searchTerm, page }) => ({
        url: `payments?search=${searchTerm || ""}&status=${
          filter?.status || "all"
        }&originalInvoice=${filter?.originalInvoice || "all"}&emirate=${
          filter?.emirate || "all"
        }&collectedBy=${filter?.collectedBy || "all"}&fromDate=${filter?.fromDate || ""}&toDate=${filter?.toDate || ""}&page=${page || 0}`,
        method: "GET",
      }),
      providesTags: ["Payments"],
      // to transform response
      transformResponse: (data) => {
        // console.log(data, "==data from api")
        return data;
      },
    }),

    changeStatus: builder.mutation({
      query: (data) => ({
        url: `payments/${data?.paymentId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),

    addPayment: builder.mutation({
      query: (data) => ({
        url: `payments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),

    editPayment: builder.mutation({
      query: (data) => ({
        url: `payments/${data?.paymentId}`,
        method: "PUT",
        body: data?.payment,
      }),
      invalidatesTags: ["Payments"],
    }),

    deletePayment : builder.mutation({
      query: (paymentId) => ({
        url : `payments/${paymentId}`,
        method : "DELETE",
      }),
      invalidatesTags : ["Payments"],
    }),

    generatePaymentsReport: builder.mutation({
      query: ({ filter }) => ({
        url : 'payments/report',
        method: "POST",
        body : filter,
      }),
      // to transform response
      transformResponse: (data) => {
        // console.log(data, "==data from api")
        return data;
      },
    }),

    vehicleLogin : builder.mutation({
      query : () => ({
        url : "/payments/vehicle/login",
        method : "POST",
      })
    }),

    getVehiclePositons : builder.mutation({
      query: (token) => ({
        url : "/payments/vehicle/positions",
        method : "POST",
        headers : {
          Xtoken : token,
        }
      }),
    })
  }),
});

export const {
  useGetPaymentsQuery,
  useChangeStatusMutation,
  useAddPaymentMutation,
  useEditPaymentMutation,
  useDeletePaymentMutation,
  useGeneratePaymentsReportMutation,
  useVehicleLoginMutation,
  useGetVehiclePositonsMutation
} = paymentApi;
export default paymentApi;
