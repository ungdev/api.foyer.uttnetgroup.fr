const http = require('http')
const database = require('./database')
const main = require('./main')
const socketio = require('socket.io')
const env = require('../src/env')
const debug = require('debug')('api.gala.uttnetgroup.fr:bin')
const twitter = require('./twitter')

module.exports = async function(app, express) {
  const { sequelize, models } = await database()


  const server = http.Server(app)
  const io = socketio(server)

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
    debug(`server started on port ${env.API_PORT} [${env.NODE_ENV}]`)
  )
  twitter(app)
  return app
}
