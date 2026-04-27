import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      state.userData = payload;
    },
  },
});

export const { setUserData } = userSlice.actions;

export const selectUserData = (state) => state.user.userData;

export default userSlice.reducer;
