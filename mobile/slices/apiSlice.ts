import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { News, Activity, Featured } from "../types";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  endpoints: (builder) => ({
    getNews: builder.query<News[], void>({
      query: () => "/news",
    }),
    getActivities: builder.query<Activity[], void>({
      query: () => "/activities",
    }),
    getFeatured: builder.query<Featured[], void>({
      query: () => "/featured",
    }),
  }),
});

export const { useGetNewsQuery, useGetActivitiesQuery, useGetFeaturedQuery } =
  apiSlice;
