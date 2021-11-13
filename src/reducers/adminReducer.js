import { createSlice } from "@reduxjs/toolkit";

export const adminReducer = createSlice({
	name: "admin",
	initialState: {
		statistics: {},
		statisticsLoaded: false,
		albumsLoaded: false,
		albums: [],
	},
	reducers: {
		setStatisticsLoaded: (state, action) => {
			state.statisticsLoaded = action.payload;
		},
		saveStatistics: (state, action) => {
			state.statistics = action.payload;
		},
		setAlbumsLoaded: (state, action) => {
			state.albumsLoaded = action.payload;
		},
		saveAlbumsData: (state, action) => {
			state.albums = action.payload;
		},
	},
});

export const {
	saveStatistics,
	setStatisticsLoaded,
	setAlbumsLoaded,
	saveAlbumsData,
} = adminReducer.actions;

export default adminReducer.reducer;
