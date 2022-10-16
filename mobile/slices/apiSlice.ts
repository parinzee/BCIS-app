import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  News,
  Activity,
  Featured,
  Votd,
  Portfolio,
  GPAScore,
  TeamScores,
} from "../types";
import { serverURL } from "../utils/API";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: serverURL }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ["GPA"],
  endpoints: (builder) => ({
    getNews: builder.query<News[], void>({
      query: () => "/news",
    }),
    getActivities: builder.query<Activity[], void>({
      query: () => "/activities",
    }),
    getTeamScores: builder.query<TeamScores, void>({
      query: () => "/team-scores",
    }),
    getPortfolios: builder.query<Portfolio[], void>({
      query: () => "/portfolio",
    }),
    getFeatured: builder.query<Featured[], void>({
      query: () => "/featured",
    }),
    getVerseOfDay: builder.query<Votd, void>({ query: () => "/verse-of-day" }),
    getGPAScore: builder.query<
      GPAScore[],
      { userEmail: string; accessToken: string }
    >({
      query: (arg) => {
        return {
          url: `/gpa-score/email/?email=${arg.userEmail}`,
          headers: {
            Authorization: `Token ${arg.accessToken}`,
          },
        };
      },
      providesTags: ["GPA"],
    }),
    postGPAScore: builder.mutation<
      GPAScore[],
      { userEmail: string; accessToken: string; dateAdded: Date; gpa: number }
    >({
      query: (arg) => {
        return {
          url: "/gpa-score/",
          method: "POST",
          headers: {
            Authorization: `Token ${arg.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: arg.userEmail,
            date_added: arg.dateAdded.toISOString(),
            gpa: arg.gpa.toString(),
          }),
        };
      },
      invalidatesTags: ["GPA"],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetActivitiesQuery,
  useGetTeamScoresQuery,
  useGetFeaturedQuery,
  useGetVerseOfDayQuery,
  useGetPortfoliosQuery,
  useLazyGetGPAScoreQuery,
  usePostGPAScoreMutation,
} = apiSlice;
