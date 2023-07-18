const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // new mongodb Id Error
    if(err.name === "CastError"){
        const message = `Resource Not Found Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Toekn Is Invalid, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    // Toekn Expired Error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token Expiired, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}