import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/features/UserSlice";
import messageReducer from "@/app/features/MessageSlice"
import notificationReducer from "@/app/features/NotificationSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    notification:notificationReducer
  },
});
