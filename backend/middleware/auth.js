const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// Is Authenticate Or Not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decodedData.id);
  
    next();
  });


// Authrized Roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
    return next (
        new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this source`,
            console.log(req.user.role),
             403
        )
    );
    
    }
    next();
  };
};
