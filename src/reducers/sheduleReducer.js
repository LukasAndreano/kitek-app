import { createSlice } from "@reduxjs/toolkit";

export const sheduleReducer = createSlice({
	name: "shedule",
	initialState: {
		shedule: [],
		loaded: false,
		sheduleDay: 0,
	},
	reducers: {
		setSheduleStore: (state, action) => {
			state.shedule = action.payload;
		},
		saveSheduleDay: (state, action) => {
			state.sheduleDay = action.payload;
		},
		setAlreadyLoaded: (state, action) => {
			state.loaded = action.payload;
		},
	},
});

export const { setSheduleStore, saveSheduleDay, setAlreadyLoaded } =
	sheduleReducer.actions;

export default sheduleReducer.reducer;
