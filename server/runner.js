var cron = require('cron')
const axios = require('axios')

module.exports = {
    startCronJob () {

        var sendEmail = new cron.CronJob({
            cronTime: '* * * * *',
            onTick: function() {
              console.error('run cron job')
              axios.post('http://localhost:3000/email')
                .then(response => {
                  console.log(response)
                })
                .catch(err => {
                  console.error(err)
                })
            },
            start: false,
            timeZone: 'Asia/Jakarta'
          });
          
          sendEmail.start(); // job 1 started
           
          console.log('sendEmail status', sendEmail.running); // job1 status true

    }
}

