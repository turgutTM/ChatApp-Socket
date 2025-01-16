import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
  transports: ["websocket"],
});

export default socket;
