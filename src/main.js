const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const controllers = require('./api/controllers')
const iocontrollers = require('./api/iocontrollers')
const error = require('./api/middlewares/error')
const log = require('./api/utils/log')(module)

module.exports = (app, io) => {

  app.use(
    morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined', { stream: log.stream })
  )
  
  app.use(helmet())
  app.use(cors())
  app.use(bodyParser.json())
  app.get('/', async (req, res) => {
    return res.status(200).json('API UP').end()
  })

  app.use('/api/v1', controllers(app))
  iocontrollers(app, io)

  app.use(error.converter)
  app.use(error.notFound)
  app.use(error.handler)

  return app
}
