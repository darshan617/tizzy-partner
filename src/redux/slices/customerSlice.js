import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerData: {},
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerData: (state, { payload }) => {
      state.customerData = payload;
    },
  },
});

export const { setCustomerData } = customerSlice.actions;

export const selectCustomerData = (state) => state?.customer?.customerData || {};

export default customerSlice.reducer;
