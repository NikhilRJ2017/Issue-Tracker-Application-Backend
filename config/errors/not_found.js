const { StatusCodes } = require('http-status-codes');
const CustomErrorClass = require('./custom_errors');

// ******************** 404 error ***********************/
class NotFound extends CustomErrorClass{
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFound;