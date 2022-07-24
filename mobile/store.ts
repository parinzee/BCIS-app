import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
