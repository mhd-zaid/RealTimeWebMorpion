import verifyToken from "./../utils/token.js";
import {Op} from "sequelize";
import User from "../models/User.js";
import sequelize from "../config/sequelize.js";

export default function () {
  return async function (req, res, next) {
    const UserModel = User(sequelize);
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({message: "Vous devez vous connecter."});
    }

    try {
      const userByToken = verifyToken(token);
      const user = await UserModel.findOne({where: { token }});

      if (!userByToken || !user) {
        return res.status(401).json({success: false, message: "Vous devez vous connecter."});
      }

      req.user = userByToken;
      next();
    } catch (error) {
      return res.status(401).json({message: "Connexion non valide."});
    }
  };
};
