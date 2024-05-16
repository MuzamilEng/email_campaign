import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_KEY = import.meta.env.VITE_REACT_API_URL;
// console.log(API_KEY);
//  https://infra.chequelivros.net/bookstores

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_KEY}` }),
  tagTypes: ["Post", "User"],
  endpoints: (builder) => ({
    getAllRecords: builder.query({
      query: () => `/getAdminData`,
      providesTags: ["Post"],
    }),
    getOnlyWaitingData: builder.query({
      query: () => `/getOnlyWaitingData`,
      providesTags: ["Post"],
    }),
    getOnlyApprovedData: builder.query({
      query: () => `/getOnlyApprovedData`,
      providesTags: ["Post"],
    }),
    getOnlyRejectData: builder.query({
      query: () => `/getOnlyRejectData`,
      providesTags: ["Post"],
    }),
    deleteRecodById: builder.mutation({
      query: (id) => ({
        url: `/deleteRecord/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    submitForm: builder.mutation({
      query: (data) => ({
        url: "/upload",
        method: "POST",
        body: data,
      }),
      providesTags: ["User"],
    }),
    updateRecord: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updateRecord/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    updateAdminStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updateStatus/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAdminData: builder.mutation({
      query: (id) => ({
        url: `/deleteAdminData/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllRecordsQuery,
  useDeleteRecodByIdMutation,
  useSubmitFormMutation,
  useUpdateRecordMutation,
  useDeleteAdminDataMutation,
  useUpdateAdminStatusMutation,
  useGetOnlyWaitingDataQuery,
  useGetOnlyApprovedDataQuery,
  useGetOnlyRejectDataQuery,
} = storeApi;
