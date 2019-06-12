const http = require('http')
const database = require('./database')
const main = require('./main')
const socketio = require('socket.io')
const env = require('../src/env')
const log = require('./api/utils/log')(module)
const twitter = require('./twitter')
const schedule = require('./schedule')

module.exports = async function(app, express) {
  const { sequelize, models } = await database()

  const server = http.Server(app)
  const io = socketio(server, {path: '/api/socket.io'})

  main(app, io)
  app.locals.app = app
  app.locals.server = server
  app.locals.db = sequelize
  app.locals.models = models
  app.locals.io = io

  if (process.send) {
    process.send('ready')
  }

  server.listen(env.API_PORT, () =>
    log.info(`Server started on port ${env.API_PORT} [${env.NODE_ENV}]`)
  )
  twitter(app)
  schedule(app)
  return app
}
