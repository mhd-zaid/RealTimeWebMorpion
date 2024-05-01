import jwt from "jsonwebtoken"

export default () => ({
  createToken: (user) => {
    if (!user) {
      throw new Error("Utilisateur non défini");
    }

    return jwt.sign(
      {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  },

  verifyToken: (token) => {
    if (!token) {
      throw new Error("Token non défini ou vide");
    }

    try {
      return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      console.error("Échec de la vérification du token:", error);
      return null;
    }
  }
})