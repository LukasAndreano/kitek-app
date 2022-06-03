import { createSlice } from "@reduxjs/toolkit";

export const mainReducer = createSlice({
  name: "main",
  initialState: {
    isDesktop: false,
    platform: "",
    groups: null,
    teachers: null,
    selected: {
      type: null,
      id: null,
    },
  },
  reducers: {
    setIsDesktop: (state, action) => {
      state.isDesktop = action.payload;
    },
    setPlatform: (state, action) => {
      state.platform = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setTeachers: (state, action) => {
      state.teachers = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const {
  setIsDesktop,
  setPlatform,
  setGroups,
  setTeachers,
  setSelected,
} = mainReducer.actions;

export default mainReducer.reducer;
