const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-errors");
module.exports = (req, res, next) => {
  try {
    if(req.method === 'OPTIONS'){
        return next();
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication Failed");
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(new HttpError("Authentication Failed", 401));
  }
};
