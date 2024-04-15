import { Server } from "socket.io"

const io = new Server(process.env.WEB_SOCKET_PORT, {
    cors: {
      origin: true
    }
  });

export default io;