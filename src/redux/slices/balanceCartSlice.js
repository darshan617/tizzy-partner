import { createSlice } from "@reduxjs/toolkit";

const balanceCartSlice = createSlice({
  name: "balanceCart",
  initialState: {
    balanceAndCartData: null,
  },
  reducers: {
    setBalanceAndCartData: (state, action) => {
      state.balanceAndCartData = action.payload;
    },
  },
});

export const { setBalanceAndCartData } = balanceCartSlice.actions;
export default balanceCartSlice.reducer;
