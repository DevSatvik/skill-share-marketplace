const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ error: `Only ${role} accounts can access this` });
    }
    next();
  };
};

export default requireRole;