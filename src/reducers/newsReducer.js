import { createSlice } from "@reduxjs/toolkit";

export const newsReducer = createSlice({
	name: "news",
	initialState: {
		data: [],
	},
	reducers: {
		saveData: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const { saveData } = newsReducer.actions;

export default newsReducer.reducer;
