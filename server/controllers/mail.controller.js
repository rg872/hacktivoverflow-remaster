const nodemailer = require("nodemailer");

const Mail = require('../models/mail.model')

const myEmail = process.env.EMAIL
const myEmailPass = process.env.EMAIL_PASS

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    myEmail,
    myEmailPass
  }
});

module.exports = {
  sendEmail (req, res) {
      Mail.find({})
      .populate('user')
      .then(users => {
          if(users.length > 0 && typeof users !== 'undefined' && users !== null){
            users.forEach(user => {
                let mailOptions = {
                    from: myEmail,
                    to: user.email,
                    subject: 'Hey, Welcome to Hacktiv Overflow',
                    text: 'Now you are a member of Hacktiv Overflow. You can ask everything related to programming'
                  }
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  })
                  Mail.findByIdAndRemove(user._id)
                    .then(() => {
                        res.status(200).json({
                            message: 'Success send registration email'
                        })
                    })  
                    .catch(err => {
                        res.status(500).json({
                            message: err.message
                        })
                    })
              })
          }
          
      })
      .catch(err => {
          res.status(500).json({
              message: err.message
          })
      })
  }
}