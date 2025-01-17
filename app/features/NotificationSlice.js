import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [], 
  friendRequestCount: 0, 
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
   
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
   
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
 
    clearNotifications: (state) => {
      state.notifications = [];
    },
   
    setFriendRequestCount: (state, action) => {
      state.friendRequestCount = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  setFriendRequestCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
