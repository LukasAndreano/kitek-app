import { configureStore } from "@reduxjs/toolkit";

// Импортим все редюсеры
import mainReducer from "./reducers/mainReducer";
import timeReducer from "./reducers/timeReducer";
import newsReducer from "./reducers/newsReducer";
import sheduleReducer from "./reducers/sheduleReducer";
import adminReducer from "./reducers/adminReducer";

export const store = configureStore({
	reducer: {
		main: mainReducer,
		time: timeReducer,
		news: newsReducer,
		shedule: sheduleReducer,
		admin: adminReducer,
	},
});
