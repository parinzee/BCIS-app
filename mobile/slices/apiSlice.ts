import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { News } from "../types";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  endpoints: (builder) => ({
    getNews: builder.query<News[], void>({
      query: () => "/news",
    }),
  }),
});

export const { useGetNewsQuery } = apiSlice;
