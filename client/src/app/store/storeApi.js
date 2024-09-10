import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_KEY = import.meta.env.VITE_REACT_API_URL;
// console.log(API_KEY);
//  https://infra.chequelivros.net/bookstores
const token = JSON.parse(localStorage.getItem("token"));
export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_KEY}`,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${token?.token}`);
    },
  }),
  tagTypes: ["Post", "currentUser"],
  endpoints: (builder) => ({
    getAllRecords: builder.query({
      query: (id) => `/getAdminData/${id}`,
      providesTags: ["Post"],
    }),
    adminRecords: builder.query({
      query: () => `/getAdminRecords`,
      providesTags: ["Post"],
    }),
    getInvoicesDetails: builder.query({
      query: () => `/getInvoicesDetails`,
      providesTags: ["Post"],
    }),
    deleteRecodById: builder.mutation({
      query: (id) => ({
        url: `/deleteRecord/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    getLogedinUser: builder.query({
      query: () => `/getCurrentUser`,
      providesTags: ["currentUser"],
    }),
    submitForm: builder.mutation({
      query: (data) => ({
        url: "/upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["currentUser"],
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
      providesTags: ["User"],
    }),
    uploadReport: builder.mutation({
      query: (data) => ({
        url: "/uploadInvoice ",
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
  useGetInvoicesDetailsQuery,
  useDeleteRecodByIdMutation,
  useSubmitFormMutation,
  useUpdateRecordMutation,
  useDeleteAdminDataMutation,
  useUpdateAdminStatusMutation,
  useUploadReportMutation,
  useSignupMutation,
  useGetLogedinUserQuery,
  useAdminRecordsQuery,
} = storeApi;
