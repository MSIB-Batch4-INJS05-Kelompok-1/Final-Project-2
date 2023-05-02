const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY);
}

function verifyToken(token) {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

module.exports = { generateToken, verifyToken };
