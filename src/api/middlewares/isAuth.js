const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const log = require('../utils/log')(module)
const moment = require('moment')

jwt.verify = promisify(jwt.verify)

module.exports = route => async (req, res, next) => {
  const { User, Permission } = req.app.locals.models

  const date = req.get('X-Date')
  const enabled = false // put at false when you want to use postman for example
  if (enabled && date && moment().format('x') - moment(date).format('x') > 10000)
    return res
      .status(401)
      .json({ error: 'TOO_LATE' })
      .end()
  const auth = req.get('Authorization')
  if (!auth || auth.length === 0) {
    log.warn('Missing token', { route })

    return res
      .status(401)
      .json({ error: 'NO_TOKEN' })
      .end()
  }
  const token = auth.split('Basic ')[1]

  if (!token || token.length === 0) {
    log.warn('Missing token', { route })

    return res
      .status(401)
      .json({ error: 'NO_TOKEN' })
      .end()
  }

  try {
    const decoded = await jwt.verify(token, process.env.API_SECRET)

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Permission, attributes: ['name'] }]
    })
    user.permissions = user.permissions.map(permission => permission.name)
    req.user = user
    next()
  } catch (err) {
    log.warn('invalid token', { route })

    return res
      .status(401)
      .json({ error: 'INVALID_TOKEN' })
      .end()
  }
}
