import User from "../models/User";

const isAdmin = async (req, res, next) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).send("No user");
  }
  if (user.role !== "admin") {
    return res.status(403).send("Not authorized");
  }
  next();
};

module.exports = isAdmin;