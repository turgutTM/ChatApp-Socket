import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [], 
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload); 
    },
    updateMessageReadStatus: (state, action) => {
      const { messageId, read } = action.payload;
      const message = state.messages.find(msg => msg.messageId === messageId);
      if (message) {
        message.read = read; 
      }
    },
    clearMessages: (state) => {
      state.messages = []; 
    },
    deleteMessage: (state, action) => {
      const { messageId } = action.payload;
      state.messages = state.messages.filter(msg => msg.messageId !== messageId); 
    },
  },
});

export const { addMessage, updateMessageReadStatus, clearMessages, deleteMessage } = messageSlice.actions;

export default messageSlice.reducer;
