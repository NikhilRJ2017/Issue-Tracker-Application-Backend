const { StatusCodes } = require('http-status-codes');
const CustomErrorClass = require('./custom_errors');

// ************************ 400 error **********************/
class BadRequest extends CustomErrorClass{
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequest;