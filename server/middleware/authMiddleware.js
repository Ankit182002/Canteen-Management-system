const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ================= PROTECT ================= */
exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

/* ================= AUTHORIZE ================= */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
};

/* ================= OWNER APPROVAL ================= */
exports.ownerApproved = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  if (req.user.role === "owner" && !req.user.isApproved) {
    return res.status(403).json({
      msg: "Waiting for admin approval"
    });
  }

  next();
};