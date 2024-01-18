// socketManager.js
const user = JSON.parse(localStorage.getItem("user"));
import { io } from "socket.io-client";

const ENDPOINT = `${import.meta.env.VITE_SOCKET_ENDPOINT}`;
const socket = io(ENDPOINT)




export default socket;
