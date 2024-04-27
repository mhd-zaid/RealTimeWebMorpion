import tokenUtils from '../utils/token.js';

const checkAuthSocket = async (socket, db) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return false;
  }

  const tokenUtil = tokenUtils();
  const userInfo = tokenUtil.verifyToken(token);

  if (!userInfo) {
    return false;
  }

  const user = await db.User.findByPk(userInfo.id);

  if (!user) {
    return false;
  }
  return user;
};

export default checkAuthSocket;
