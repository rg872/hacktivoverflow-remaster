const bcrypt = require('bcryptjs')

module.exports = {
    encryptPassword (password) {
        try {
            password = bcrypt.hashSync(password, 10)
            return password
        } catch (error) {
            console.log(error)
            throw new Error ('Error when encrypt password')
        }
    },
    decryptPassword (password, hash) {
        let check
        try {
            check = bcrypt.compareSync(password, hash)
            return check
        } catch (error) {
            console.log(error)
            throw new Error ('Error when decrypt password')
        }
    }
}