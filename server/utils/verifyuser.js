import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("token gets :", token);

  if (!token) {
    return next(errorHandler(401, "UnAuthorized!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "UnAuthorized!"));
    }

    req.user = user;

    next(); // if token is there then only go to the next controller ex:updateUser
  });
};
