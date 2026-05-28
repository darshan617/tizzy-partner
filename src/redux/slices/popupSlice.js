import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPopupVisible: "",
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setIsPopupVisible: (state, { payload }) => {
      state.isPopupVisible = payload;
    },
  },
});

export const { setIsPopupVisible } = popupSlice.actions;

export const selectIsPopupVisible = (state) => state?.popup?.isPopupVisible;

export default popupSlice.reducer;
