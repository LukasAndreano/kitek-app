import { createSlice } from "@reduxjs/toolkit";

export const adminReducer = createSlice({
	name: "admin",
	initialState: {
		statistics: {},
		statisticsLoaded: false,
	},
	reducers: {
		setStatisticsLoaded: (state, action) => {
			state.statisticsLoaded = action.payload;
		},
		saveStatistics: (state, action) => {
			state.statistics = action.payload;
		},
	},
});

export const { saveStatistics, setStatisticsLoaded } = adminReducer.actions;

export default adminReducer.reducer;
