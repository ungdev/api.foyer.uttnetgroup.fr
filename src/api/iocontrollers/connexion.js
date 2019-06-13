const updateDiapo = require('../utils/updateDiapo')
const updateLogos = require('../utils/updateLogos')
const updateMeteo = require('../utils/updateMeteo')

module.exports = (app, io) => {
  io.on('connection', async socket => {
    console.log('CONNEXION')
    try {
      await updateDiapo(app)
      await updateLogos(app)
      await updateMeteo(app)
      const { Tweet } = app.locals.models

      const tweets = await Tweet.findAll({ order: [['createdAt', 'DESC']] })
      socket.emit('tweets', tweets)
      socket.on('disconnect', () => {
        console.log('DISCONNEXION')
      })
    } catch (e) {
      console.log(e)
    }
  })
}
