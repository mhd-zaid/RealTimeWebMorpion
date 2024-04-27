import tokenUtils from '../utils/token.js';

const checkAuthSocket = async (socket, db) => {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader) {
        return false;
    }
    if (!authHeader.startsWith('Bearer ')) {
        return false;
    }
    
    const token = authHeader.substring(7, authHeader.length);
    
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
    }

export default checkAuthSocket;