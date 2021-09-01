import { createSlice } from "@reduxjs/toolkit";

export const mainReducer = createSlice({
  name: "main",
  initialState: {
    isDesktop: false,
    url: "/",
    activeModal: null
  },
  reducers: {
    savePlatform: (state, action) => {
      state.isDesktop = action.payload;
    },
    saveURL: (state, action) => {
      state.url = action.payload
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload
    }
  },
});

export const { savePlatform, saveURL, setActiveModal } = mainReducer.actions;

export default mainReducer.reducer;
