import db from "../models/index.js";
import tokenUtils from "../utils/token.js";

const verifyUser = (io,db) => {
  io.use(async (socket, next) => {
    console.log("ici")

    const authHeader = socket.handshake.headers.authorization;

    if (!authHeader) {
      return next(new Error("Vous devez être connecté"));
    }

    if (!authHeader.startsWith('Bearer ')) {
      return next(new Error("Vous devez être connecté"));
    }

    const token = authHeader.substring(7, authHeader.length);

    const tokenUtil = tokenUtils();
    const userInfo = tokenUtil.verifyToken(token);

    if (!userInfo) {
      return next(new Error("Vous devez être connecté"));
    }

    const user = await db.User.findByPk(userInfo.id);

    if (!user) {
      return next(new Error("Vous devez être connecté"));
    }
    console.log("ici")

    socket.userId = user.dataValues.id;

    next();
  });
};

export default verifyUser;
