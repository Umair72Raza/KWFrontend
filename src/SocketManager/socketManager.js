// socketManager.js
const user = JSON.parse(localStorage.getItem("user"));
import { io } from "socket.io-client";

const ENDPOINT = `${import.meta.env.VITE_SOCKET_ENDPOINT}`;
const socket = io(ENDPOINT);
if (user && user._id) {
  socket.emit("setup", user);
} 
else {
  socket.disconnect();
}

if (user && user._id) {
  socket.emit("new-user-add", user._id);
} 
else {
    socket.disconnect();
}
if(user && user._id)
{
socket.on("connection", ("true"));
}
else{
    socket.disconnect();
}
  

export default socket;
