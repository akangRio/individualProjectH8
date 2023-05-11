const jwt = require("jsonwebtoken");
const privateKey = process.env.JWTSECRET;
const generateToken = (payload) => {
  return jwt.sign({ payload }, privateKey);
};
const verifyToken = (token) => {
  return jwt.verify(token, privateKey);
};
module.exports = { generateToken, verifyToken };
