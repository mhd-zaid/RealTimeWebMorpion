import bcryptjs from "bcrypt";
import ValidationError from "../errors/ValidationError.js";
import User from "../models/User.js";

module.exports = async function (req, res, next) {
  try {
    if (req.body.password) {
      if (!req.body.oldPassword) {
        return next(
          new ValidationError({
            oldPassword: "Veuillez saisir votre ancien mot de passe.",
          })
        );
      }
      const user = await User.findByPk(req.params.id);

      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return next(
          new ValidationError({
            oldPassword: "Mauvais mot de passe actuel.",
          })
        );
      }
    }
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}