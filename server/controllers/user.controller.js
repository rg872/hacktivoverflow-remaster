const User = require('../models/users.model')
const Mail = require('../models/mail.model')
const createToken = require('../helpers/jwt.helper')
const { decryptPassword } = require('../helpers/password.helper')

module.exports = {
    signUp (req, res) {
      let user = new User(req.body)
      let error = user.validateSync()
      if (error) {
        res.status(400).json({
          message: error.message
        })
      } else {
        user.save()
        .then(user => {
          Mail.create({user: user._id})
          .then(() => {
            let token = createToken({email: user.email})
            res.header({
              'Access-Control-Expose-Headers': 'token',
              token
            })
            res.status(200).json({
                message: 'Success create user',
                id: user._id
            })
          })
        })
        .catch(err => {
          res.status(500).json({
            message: err.errmsg
          })
        })  
      }
    },

    signIn (req, res) {
      let { email, password } = req.body
      User.findOne({email})
      .then(user => {
        if(user) {
          if (decryptPassword(password, user.password)){
            let token = createToken({email: user.email})
            res.header({
            'Access-Control-Expose-Headers': 'token',
            token
          })
            res.status(200).json({
                message: 'Success signin user',
                id: user._id
            })
          } else {
            res.status(400).json({
              message: 'wrong password is inputed'
            })
          }
        } else {
          res.status(400).json({
            message: 'cant find user, invalid email'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err.errmsg
        })
      })
    },
    
    oAuth (req, res) {
      let { email } = req.body
      User.findOne({ email })
      .then((user)=>{                
        if(user){
          let token = createToken({email: user.email})
          res.header({
              'Access-Control-Expose-Headers': 'token',
              token
            })
          res.status(200).json({
            message:'oauth signin succeed',
            id: user._id
          })
        } else {
          User.create({email, password: process.env.OAUTH_USER_PASS, role: 'user'})
          .then((user)=>{
            Mail.create({user: user._id})
            .then(() => {
              let token = createToken({email: user.email})
              res.header({
                'Access-Control-Expose-Headers': 'token',
                token
              })
              res.status(200).json({
                  message: 'Success create user from oauth',
                  id: user._id
              })
            })
          })
        }

      })
      .catch((err)=>{
        res.status(500).json({
          message: err.errmsg
        })
      })
    }
}