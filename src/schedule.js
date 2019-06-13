const schedule = require('node-schedule')
const updateDiapo = require('./api/utils/updateDiapo')
const updateLogos = require('./api/utils/updateLogos')

module.exports = app => {
  schedule.scheduleJob('5 0 * * * *', () => {
    // at every hour and 5 seconds (11:00:05, 12:00:05, ...)
    updateDiapo(app)
    updateLogos(app)
  })
  schedule.scheduleJob('5 30 * * * *', () => {
    // at every hour and a half and 5 seconds (11:30:05, 12:30:05, ...)
    updateDiapo(app)
    updateLogos(app)
  })
  console.log('SCHEDULE SUCCESSFULLY SETUP')
}
