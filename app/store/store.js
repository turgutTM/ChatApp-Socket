import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/features/UserSlice";
import messageReducer from "@/app/features/MessageSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
  },
});
