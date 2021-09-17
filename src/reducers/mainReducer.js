import { createSlice } from "@reduxjs/toolkit";

export const mainReducer = createSlice({
  name: "main",
  initialState: {
    isDesktop: false,
    url: "/",
    activeModal: null,
    snackbar: {
      text: null,
      success: true,
    },
    popout: {
      title: null,
      text: null,
    },
    user: {
      name: null,
      email: null,
      group: null,
      status: 0,
    },
    currentForm: 1,
  },
  reducers: {
    savePlatform: (state, action) => {
      state.isDesktop = action.payload;
    },
    saveURL: (state, action) => {
      state.url = action.payload;
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    setPopout: (state, action) => {
      state.popout = { title: action.payload.title, text: action.payload.text };
    },
    setSnackbar: (state, action) => {
      state.snackbar = {
        text: action.payload.text,
        success: action.payload.success,
      };
    },
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  savePlatform,
  saveURL,
  setActiveModal,
  setSnackbar,
  setCurrentForm,
  setUser,
  setPopout,
} = mainReducer.actions;

export default mainReducer.reducer;
