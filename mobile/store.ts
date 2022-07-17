import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./slices/newsSlice";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    news: newsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
