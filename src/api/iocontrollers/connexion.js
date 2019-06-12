const updateDiapo = require('../utils/updateDiapo')

module.exports = (app, io) => {
  io.on('connection', async socket => {
    console.log('CONNEXION')
    try {
      await updateDiapo(app)
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
