import { configureStore } from "@reduxjs/toolkit";
import main from "./reducers/main";

export const store = configureStore({
  reducer: {
    main,
  },
});
