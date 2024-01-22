import { createSlice } from '@reduxjs/toolkit';
import { CgCollage } from 'react-icons/cg';

import { io } from "socket.io-client";
const user = JSON.parse(localStorage.getItem("user"));
const ENDPOINT = `${import.meta.env.VITE_SOCKET_ENDPOINT}`;
const initialState = {
  socket: null,
};

const socketslice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state,action) => {
      const User = action.payload
      if (User && User._id ) {
        console.log("this is console from socket")
        state.socket = io(ENDPOINT);
        state.socket.emit("setup", User);
        state.socket.emit("new-user-add", User._id);
        state.socket.on("connection", "true");
        console.log("user in connection")
      } else {
        state.socket?.disconnect();
      }
    }}
});

export const { setSocket } = socketslice.actions;


export default socketslice.reducer;