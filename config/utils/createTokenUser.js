// ****************** create token/payload for creating jwt ******************/
const createTokenUser = (user) => { 
    return {
        name: user.name,
        userId: user._id
    }
}

module.exports = createTokenUser;