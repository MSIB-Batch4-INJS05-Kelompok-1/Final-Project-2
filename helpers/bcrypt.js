const bcrypt = require("bcrypt");
const saltRounds = 10;

function hashPassword(password) {
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
}

function comparePassword(password, hash) {
  const result = bcrypt.compareSync(password, hash);
  return result;
}

module.exports = { hashPassword, comparePassword };
