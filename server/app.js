import express from 'express';
import sequelize from './src/config/sequelize.js';
import router from './src/config/router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import validationErrorMiddleware from './src/middlewares/validationErrorMiddleware.js';
import io from "./src/config/webSocket.js";
import db from './src/models/index.js';

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));
app.use(
  cors(),
);

// router
router(app, express);
app.use(validationErrorMiddleware);

// Sequelize
try {
  sequelize.authenticate().then(console.log('Connected to postgres'));
} catch (e) {
  console.error(`Error connecting to postgres: ${e}`);
}

try {
  io.on("connection",socket => {
    socket.on("getAllMessages", async (token) => {
      const messages = await db.Message.findAll();
      socket.emit("allMessages", messages);
    });
  });
} catch (e) {
  console.error(`Error connecting to socket: ${e}`);
}

export default app;
