const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

module.exports = app => {
  app.delete('/users/:id/admin', [
    isAuth('remove-admin'),
    isAdmin('remove-admin')
  ])
  app.delete('/users/:id/admin', async (req, res) => {
    const { Permission } = app.locals.models
    try {
      let permission = await Permission.findOne({
        where: { userId: req.params.id }
      })
      if (!permission)
        return res
          .status(404)
          .json({ error: 'NOT_FOUND' })
          .end()
      await permission.destroy()
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
