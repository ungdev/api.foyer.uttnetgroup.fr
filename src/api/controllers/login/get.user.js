const isAuth = require('../../middlewares/isAuth')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)
const pick = require('lodash.pick')
/**
 * GET /user
 *
 * Response:
 * {
 *    user: User
 * }
 */
module.exports = app => {
  app.get('/user', [isAuth('user-fetch')])

  app.get('/user', async (req, res) => {
    try {
      log.info(`user ${req.user.full_name} fetch his infos`)
      res
        .status(200)
        .json(pick(req.user, ['id', 'full_name', 'permissions']))
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
