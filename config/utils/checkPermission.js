const { UnauthorizeError } = require('../errors/index');

// ****************** check permission for resource access ********************/
const checkPermission = (reqUser, resourceUserId ) => { 
    if (reqUser.userId === resourceUserId.toString()) {
        return;
    }

    throw new UnauthorizeError("Not authorized to access this resource");
}

module.exports = checkPermission;