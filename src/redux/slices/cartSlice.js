import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartData: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (state, { payload }) => {
      state.cartData = payload;
    },
    setPricePerUser: (state, { payload }) => {
      state.pricePerUser = payload;
    },
  },
});

export const { setCartData, setPricePerUser } = cartSlice.actions;

export const selectCartData = (state) => state?.cart?.cartData || {};
export const selectPricePerUser = (state) => state?.cart?.pricePerUser || 0;
export default cartSlice.reducer;
