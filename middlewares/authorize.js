const jwt = require("jsonwebtoken");

const { User } = require("../schemas/users");

require("dotenv").config();

const { SECRET_KEY } = process.env;

const authorize = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return res.status(401).json({
      status: "error",
      message: "Not authorized",
      data: "Unauthorized",
    });
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || user.token !== token || !user.token) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      status: "error",
      message: "Not authorized",
      data: "Unauthorized",
    });
  }
};

module.exports = authorize;
