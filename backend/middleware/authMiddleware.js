import { promisify } from "util";
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";
import { AppError } from "../utils/appError.js";

// // Protect User Routes
const protect = asyncHandler(async (req, res, next) => {
  // Get token and check its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }



  if (!token) {
    return next(new AppError("You arre not logged in! Please log in", 401));
  }

  // Verify token hasn't expired or been manipulated
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const user = await User.findById(decoded.userId);
  if (!user) {
    return new AppError(
      "The user belonging to this token does no longer exist",
      401
    );
  }

  //Check if user did not change their password
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "The user has recently changed their password. Please log in again",
        401
      )
    );
  }

  //Grant access to the protected route

  req.user = user;

  next();
});

// Restrict access

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export { protect, restrictTo };

// // Protect User Routes
// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Read the JWT from the cookie
//   token = req.cookies.jwt;

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET); //decoded becomes an object with a userId field
//       // console.log(decoded);
//       req.user = await User.findById(decoded.userId).select("-password"); // returns user without the password
//       next();
//

//     throw new Error("Not authorized, no token");
//   }
// });

//Protect Admin Routes
// const protectAdmin = asyncHandler(async (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     console.log("ROLE...", req.user.role);
//     next();
//   } else {
//     res.status(401);
//     throw new Error(
//       "Not authorized, you are not authorized to access this route"
//     );
//   }
// });

// export { protectAdmin, protect };
