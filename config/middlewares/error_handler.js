const { StatusCodes } = require('http-status-codes');

// ********************* express inbuilt error handler middleware *************************/
const errorHandler = (err, req, res, next) => { 
    
    const customError = {
        message: err.message || "Something went wrong, Please try again",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }

    //?11000 is a mongoose error for duplicate entries
    if(err.code && err.code === 11000){
        // customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.message = `${Object.keys(err.keyValue)} already exists`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    //?mongoose validation error
    if(err.name === 'ValidationError'){
        customError.message = Object.values(err.errors).map((item)=>item.message).join(',');
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    //?mongoose cast error/syntax error
    if(err.name === 'CastError'){
        customError.message = `No item found with id : ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }

    return res.status(customError.statusCode).json({
        message: customError.message
    });
}

module.exports = errorHandler;