module.exports = function (req, res, next) {
  const userId = req.params.UserId;

  if (req.user.id !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
