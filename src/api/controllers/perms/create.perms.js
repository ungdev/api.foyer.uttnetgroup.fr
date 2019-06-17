const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

module.exports = app => {
  app.post('/perms', [
    check('name')
      .optional()
      .isString(),
    check('day')
      .exists()
      .isString(),
    check('start')
      .exists()
      .isString(),
    check('end')
      .exists()
      .isString(),
    validateBody()
  ])
  app.post('/perms', [isAuth('create-perm'), isAdmin('create-perm')])
  app.post('/perms', async (req, res) => {
    const { Perm } = app.locals.models
    try {
      const perm = await Perm.create(req.body)
      return res
        .status(200)
        .json(perm)
        .end()
    } catch (err) {
      errorHandler(err, req, res)
    }
  })
}
