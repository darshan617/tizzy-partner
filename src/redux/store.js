import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/redux/slices/userSlice";
import { createWrapper } from "next-redux-wrapper";
import { apiSlice } from "./apiSlice";
import servicesSlice from "./slices/servicesSlice";
import customerSlice from "./slices/customerSlice";
import cartSlice from "./slices/cartSlice";
import popupSlice from "./slices/popupSlice";
import balanceCartSlice from "./slices/balanceCartSlice";

const makeStore = () => {
  const store = configureStore({
    reducer: {
      user: userSlice,
      services: servicesSlice,
      customer: customerSlice,
      cart: cartSlice,
      popup: popupSlice,
      balanceCart: balanceCartSlice,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  return store;
};

export const storeWrapper = createWrapper(makeStore);
