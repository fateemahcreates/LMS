const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    // Make comparison case-insensitive
    const allowedRoles = roles.map(role =>
      role.toLowerCase()
    );

    const currentRole = (
      req.user.role || ""
    ).toLowerCase();

    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    next();
  };
};

module.exports = { authorize };