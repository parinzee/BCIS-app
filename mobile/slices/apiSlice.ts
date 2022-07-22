import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { News, Activity, Featured, Votd, Portfolio } from "../types";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getNews: builder.query<News[], void>({
      query: () => "/news",
    }),
    getActivities: builder.query<Activity[], void>({
      query: () => "/activities",
    }),
    getPortfolios: builder.query<Portfolio[], void>({
      query: () => "/portfolio",
    }),
    getFeatured: builder.query<Featured[], void>({
      query: () => "/featured",
    }),
    getVerseOfDay: builder.query<Votd, void>({ query: () => "/verse-of-day" }),
  }),
});

export const {
  useGetNewsQuery,
  useGetActivitiesQuery,
  useGetFeaturedQuery,
  useGetVerseOfDayQuery,
  useGetPortfoliosQuery,
} = apiSlice;
