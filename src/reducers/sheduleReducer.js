import { createSlice } from "@reduxjs/toolkit";

export const sheduleReducer = createSlice({
  name: "shedule",
  initialState: {
    shedule: [],
    sheduleDay: 0,
  },
  reducers: {
    setSheduleStore: (state, action) => {
      state.shedule = action.payload;
    },
    saveSheduleDay: (state, action) => {
      state.sheduleDay = action.payload;
    },
  },
});

export const { setSheduleStore, saveSheduleDay } = sheduleReducer.actions;

export default sheduleReducer.reducer;
