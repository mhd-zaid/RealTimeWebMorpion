import express from 'express';
import sequelize from './src/config/sequelize.js';
import router from './src/config/router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import tokenUtils from './src/utils/token.js';
import { Server } from "socket.io"
import webSocket from './src/config/webSocket.js';
import checkAuth from "./src/middlewares/checkAuth.js";
const app = express();
const { verifyToken } = tokenUtils();

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// router
// app.use(checkAuth());
router(app, express);
// app.use(validationErrorMiddleware);

// socket
try {
  const io = new Server(process.env.WEB_SOCKET_PORT, {
      cors: {
        origin: true
      }
    });
  webSocket(io);
} catch (e) {
  console.error(`Error connecting to socket: ${e}`);
}
// Sequelize
try {
  sequelize.authenticate().then(console.log('Connected to postgres'));
} catch (e) {
  console.error(`Error connecting to postgres: ${e}`);
}

export default app;
