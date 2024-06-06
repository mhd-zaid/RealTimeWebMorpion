import {uuidv7} from 'uuidv7';
import ValidationError from '../errors/ValidationError.js';
import sendMail from '../controllers/mailController.js';
import User from '../models/User.js';
import sequelize from '../config/sequelize.js';
import {promises as fs} from 'fs';
import bcrypt from 'bcryptjs';
import tokenUtils from '../utils/token.js';
import {Op} from 'sequelize';
import crypto from 'crypto';

const UserModel = User(sequelize);
const { createToken, verifyToken } = tokenUtils();

async function verifyPassword(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Erreur lors de la comparaison des mots de passe :', error);
    return false;
  }
}

export default () => ({
  me: async (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Token manquant ou invalide" });
    }
    try {
      const user = verifyToken(token);
      if (!user) {
        return res.status(401).json({ success: false, message: "Non autorisé" });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res.status(401).json({ message: "Token invalide" });
    }
  },

  register: async (req, res, next) => {
    try {
      const id = uuidv7();
      const user = await UserModel.create({
        id,
        ...req.body,
        isVerified: false,
        role: 'user',
      });
      res.status(201).json({
        success: true,
        message: 'Utilisateur crée avec succès !',
        data: user,
      });
    } catch (error) {
      if (
          error.name === 'SequelizeValidationError' ||
          error.name === 'SequelizeUniqueConstraintError'
      ) {
        error = ValidationError.fromSequelize(error);
        console.log(error);
      }
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return next(
            new ValidationError({
              global: 'Veuillez fournir un email et un mot de passe.',
            }),
        );
      }

      const user = await UserModel.findOne({
        where: {
          [Op.or]: [{ email: identifier }, { userName: identifier }],
        },
      });

      if (!user) {
        return next(
            new ValidationError({
              global: "L'identifiant ou le mot de passe n'est pas valide.",
            }),
        );
      }

      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "L'identifiant ou le mot de passe n'est pas valide.",
        });
      }
      if (!user.isVerified) {
        let content = await fs.readFile(
            `mails/validateUserAccount.txt`,
            'utf8',
        );
        const token = createToken(user);
        await user.update({ token: token });
        content = content
            .replace('{{name}}', user.userName)
            .replace(
                '{{confirmLink}}',
                `${process.env.SERVER_URL}/verify/${token}`,
            );
        await sendMail(user.email, 'Vérifiez votre compte', null, content);
        return next(
            new ValidationError({
              global:
                  "Votre compte n'a pas été vérifie. Un email de vérification vous a été envoyé",
            }),
        );
      }

      const token = createToken(user);
      await user.update({token: token});

      return res.json({
        success: true,
        message: 'Authentification réussie.',
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  },

  logout: (req, res) => {
    res.clearCookie('jwt');
    res.status(200).send();
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) {
        return next(new ValidationError({ global: 'Veuillez fournir un nouveau mot de passe.' }));
      }

      const user = await UserModel.findOne({ where: { token } });

      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/pagenotfound`, 404);
      }

      await user.update({ password, token: null });

      let content = await fs.readFile(`mails/passwordResetConfirmation.txt`, 'utf8');
      await sendMail(user.email, 'Réinitialisation du mot de passe réussie', null, content);

      res.status(200).json({ success: true, message: 'Réinitialisation du mot de passe réussie.' });
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Veuillez fournir un email.' });
      }

      const user = await UserModel.findOne({ where: { email } });

      if (user) {
        let content = await fs.readFile(`mails/forgetPassword.txt`, 'utf8');
        const token = crypto.randomBytes(20).toString('hex');
        content = content.replace(`{{url_forget}}`, `${process.env.CLIENT_URL}/auth/resetpassword/${token}`);
        await sendMail(user.email, 'Reinitialiser votre mot de passe', null, content);
        await user.update({ token });
      }

      res.status(200).json({ success: true, message: "Un email a été envoyé à l'adresse indiquée." });
    } catch (error) {
      next(error);
    }
  },

  verifyEmail: async (req, res, next) => {
    try {
      console.log(req.params.token);
      const user = await UserModel.findOne({
        where: {token: req.params.token},
      });
      console.log(user);
      if (user && user.dataValues.isVerified) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/login`, 200, {
          success: true,
          message: 'Votre email a déjà été vérifié. Veuillez vous connecter.',
          data: user,
        });
      } else if (user) {
        await user.update({ isVerified: true });
        return res.redirect(`${process.env.CLIENT_URL}/auth/login`, 200, {
          success: true,
          message: 'Email vérifié avec succès.',
          data: user,
        });
      } else {
        return res
            .status(404)
            .json({ success: false, message: 'Utilisateur non trouvé.' });
      }
    } catch (error) {
      next(error);
    }
  },

  checkToken: async (req, res, next) => {
    try {
      const decodedToken = verifyToken(req.params.token);

      if (!decodedToken) {
        return res
            .status(401)
            .json({ success: false, message: 'Token invalide ou expiré.' });
      }

      const user = await UserModel.findOne({
        where: {
          token: req.params.token,
        },
      });

      if (user) {
        return res.status(200).json({ success: true, data: user });
      } else {
        return res
            .status(404)
            .json({ success: false, message: 'Utilisateur non trouvé.' });
      }
    } catch (error) {
      next(error);
    }
  },
});
