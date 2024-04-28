import db from "../models/index.js";
import tokenUtils from "../utils/token.js";
import ApiResponse from '../utils/apiResponse.js';

const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json(new ApiResponse(false, null, null, "Vous devez être connecté"));
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json(new ApiResponse(false, null, null, "Vous devez être connecté"));
  }

  const token = authHeader.substring(7, authHeader.length);

  const tokenUtil = tokenUtils();
  const userInfo = tokenUtil.verifyToken(token);

  if (!userInfo) {
    return res.status(401).json(new ApiResponse(false, null, null, "Vous devez être connecté"));
  }

  const user = await db.User.findByPk(userInfo.id);

  if (!user) {
    return res.status(404).json(new ApiResponse(false, null, null, "Vous devez être connecté"));
  }

  req.body.UserId = user.dataValues.id;

  next();
};

export default verifyUser;