const jwt = require('jsonwebtoken')

module.exports = {
    decryptToken (req, res, next) {
        try {
            req.payload = jwt.verify(req.headers.token, process.env.SECRET)
            next()
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: 'invalid token'
            })
        }
    }
}

