import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GetChats,
  GetMessages,
  SendMessage,
  ToggleSeen,
} from "../../APIs/chat";

export const fetchChatsAsync = createAsyncThunk(
  "Chats/WithWorkers",
  async ({ user, token }) => {
    const userId = user._id;
    const response = await GetChats(userId, token);
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  "Chat/messages",
  async (credentials) => {
    const { chatId, token } = credentials;
    const response = await GetMessages(chatId, token);
    return response.data;
  }
);

export const SendMessageAsync = createAsyncThunk(
  "Chat/SendMessage",
  async (credentials) => {
    const response = await SendMessage(credentials);
    return response.data;
  }
);

export const ToggleChatSeen = createAsyncThunk(
  "Chat/ToggleSeen",
  async (credentials) => {
    try {
      const { chatId, token, seen } = credentials;
      const response = await ToggleSeen(chatId, token, seen);
      return response;
    } catch (error) {
    }
  }
);

const ChatSlice = createSlice({
  name: "ChatSlice",
  initialState: {
    ChatsWithWorkers: null,
    messages: null,
    error: null,
    status: null,
    messageStatus: null,
  },
  reducers: {
    updateChatsWithWorkers: (state, action) => {
      state.ChatsWithWorkers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatsAsync.pending, (state) => {
        state.ChatsWithWorkers = { status: "loading" };
      })
      .addCase(fetchChatsAsync.fulfilled, (state, action) => {
        state.ChatsWithWorkers = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchChatsAsync.rejected, (state, action) => {
        state.ChatsWithWorkers = {
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(fetchMessages.pending, (state) => {
        state.messageStatus = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messageStatus = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.messageStatus = "failed";
      })
      .addCase(SendMessageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SendMessageAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(SendMessageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Capture the error message for debugging
      })
      .addCase(ToggleChatSeen.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ToggleChatSeen.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(ToggleChatSeen.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateChatsWithWorkers } = ChatSlice.actions;

export default ChatSlice.reducer;
