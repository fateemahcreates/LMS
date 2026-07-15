const authorize = (...roles) => {
  return (req, res, next) => {

    console.log("Allowed:", roles);
    console.log("User:", req.user);

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log("Current role:", req.user.role);

      return res.status(403).json({
        message: "Access denied.",
      });
    }

    next();
  };
};

module.exports = { authorize };