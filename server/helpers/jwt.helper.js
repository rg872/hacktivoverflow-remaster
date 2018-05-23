const jwt = require('jsonwebtoken')

module.exports = function createToken (payload) {
    let token
    try {
        token = jwt.sign(payload, process.env.SECRET)
        return token
    } catch (error) {
        console.log(error)
        throw new Error('Error when create token')
    }
}
