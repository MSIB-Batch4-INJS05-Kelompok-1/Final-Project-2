const { verifyToken } = require("../helpers/jwt");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decodedToken = verifyToken(token);
    req.userData = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};

const authorizeUserMiddleware = async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    if (req.userData.id !== userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = {
  authMiddleware,
  authorizeUserMiddleware,
};
