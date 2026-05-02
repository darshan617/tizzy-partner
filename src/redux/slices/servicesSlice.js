import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  subCategories: [],
  allPlans: [],
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setCategories: (state, { payload }) => {
      state.categories = payload;
    },
    setSubCategories: (state, { payload }) => {
      state.subCategories = payload;
    },
    setAllPlans: (state, { payload }) => {
      state.allPlans = payload;
    },
  },
});

export const { setCategories, setSubCategories, setAllPlans } = servicesSlice.actions;

export const selectCategories = (state) => state.services.categories;
export const selectSubCategories = (state) => state.services.subCategories;
export const selectAllPlans = (state) => state.services.allPlans;

export default servicesSlice.reducer;
