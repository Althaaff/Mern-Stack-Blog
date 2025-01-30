import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // console.log("token gets :", token);

  if (!token) {
    return next(errorHandler(401, "UnAuthorized!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    console.log("decoded user :", decodedUser);
    if (err) {
      return next(errorHandler(401, "UnAuthorized!"));
    }

    req.user = decodedUser;

    next(); // if token means user is there then only go to the next controller (passing) exmple:updateUser
  });
};
