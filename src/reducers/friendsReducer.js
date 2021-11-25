import { createSlice } from "@reduxjs/toolkit";

export const friendsReducer = createSlice({
	name: "friends",
	initialState: {
		loaded: false,
		data: [],
	},
	reducers: {
		setLoaded: (state, action) => {
			state.loaded = action.payload;
		},
		saveData: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const { saveData, setLoaded } = friendsReducer.actions;

export default friendsReducer.reducer;
