import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_KEY = import.meta.env.VITE_REACT_API_URL;

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
  tagTypes: ["Post", "currentUser", "userDetail"],
  endpoints: (builder) => ({
    getAllRecords: builder.query({
      query: (id) => `/getAdminData/${id}`,
      providesTags: ["currentUser"],
    }),
    adminRecords: builder.query({
      query: () => `/getAdminRecords`,
      providesTags: ["Post"],
    }),
    getInvoicesDetails: builder.query({
      query: () => `/getInvoicesDetails`,
      providesTags: ["getInvoice"],
    }),
    deleteRecodById: builder.mutation({
      query: (data) => ({
        url: `/deleteRecord`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["currentUser"],
    }),
    getLogedinUser: builder.query({
      query: (userId) => `/getCurrentUser/${userId}`, // Use the userId parameter in the endpoint
      providesTags: ["userDetail"],
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
      invalidatesTags: ["getInvoice"],
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
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["userDetail"],
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
  useUpdateProfileMutation,
} = storeApi;
