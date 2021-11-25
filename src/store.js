import { configureStore } from "@reduxjs/toolkit";

// Импортим все редюсеры
import mainReducer from "./reducers/mainReducer";
import newsReducer from "./reducers/newsReducer";
import sheduleReducer from "./reducers/sheduleReducer";
import adminReducer from "./reducers/adminReducer";
import friendsReducer from "./reducers/friendsReducer";

export const store = configureStore({
	reducer: {
		main: mainReducer,
		news: newsReducer,
		shedule: sheduleReducer,
		admin: adminReducer,
		friends: friendsReducer,
	},
});
