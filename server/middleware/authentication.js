const { verifyToken } = require("../helpers/jwt");

const authentication = (req, res, next) => {
  const { access_token } = req.headers;
  const payload = verifyToken(access_token);
  if (!payload) {
    throw { name: "Invalid Token" };
  }
  req.identity = payload.payload;
  console.log(payload);

  next();
};

module.exports = { authentication };
