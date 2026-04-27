import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/redux/slices/userSlice";
import { createWrapper } from "next-redux-wrapper";
import { apiSlice } from "./apiSlice";

const makeStore = () => {
  const store = configureStore({
    reducer: {
      user: userSlice,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  return store;
};

export const storeWrapper = createWrapper(makeStore);
