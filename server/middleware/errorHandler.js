const errorHandler = (err, req, res, next) => {
  console.error(err);
  let code;
  let error;
  if (err.error === "Not Found") {
    code = 404;
    error = "Not Found";
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    code = 400;
    error = err.errors.map((er) => er.message).join(", ");
  } else if (err.error === "Username or Password is Incorrect") {
    code = 401;
    error = "Username or Password is Incorrect";
  } else if (err.error === "Please Login First") {
    code = 401;
    error = "Please Login First";
  } else if (err.error === `Error Access Token`) {
    code = 401;
    error = "Error Access Token";
  } else if (err.error === `unauthorized`) {
    code = 403;
    error = "unauthorized";
  } else if (err.name === "JsonWebTokenError") {
    code = 401;
    error = "Error Invalid Token";
  } else if (err.name === "SequelizeForeignKeyConstraintError") {
    code = 400;
    error = "Error Invalid Id Entity";
  } else if (err.error === "please input email") {
    code = 401;
    error = "please input email";
  } else if (err.error === "please input password") {
    code = 401;
    error = "please input password";
  } else {
    code = 500;
    error = "Internal server Error";
  }
  console.log(code, error);
  res.status(code).json({ statusCode: code, message: error });
};
module.exports = { errorHandler };
