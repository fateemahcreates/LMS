const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("========== AUTHORIZE ==========");
    console.log("Allowed:", roles);
    console.log("User:", req.user);

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated.",
      });
    }

    const allowedRoles = roles.map(role => role.toLowerCase());
    const currentRole = (req.user.role || "").toLowerCase();

    console.log("Current Role:", currentRole);
    console.log("Allowed Roles:", allowedRoles);

    if (!allowedRoles.includes(currentRole)) {
      console.log("ACCESS DENIED");
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    console.log("ACCESS GRANTED");
    next();
  };
};

module.exports = { authorize };