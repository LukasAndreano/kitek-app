import { createSlice } from "@reduxjs/toolkit";

export const timeReducer = createSlice({
	name: "time",
	initialState: {
		tab: 1,
	},
	reducers: {
		setTab: (state, action) => {
			state.tab = action.payload;
		},
	},
});

export const { setTab } = timeReducer.actions;

export default timeReducer.reducer;
