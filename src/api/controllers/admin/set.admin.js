const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

module.exports = app => {
  app.post('/users/:id/admin', [isAuth('set-admin'), isAdmin('set-admin')])
  app.post('/users/:id/admin', async (req, res) => {
    const { User, Permission } = app.locals.models
    try {
      let user = await User.findByPk(req.params.id, { include: [Permission] })
      if (!user)
        return res
          .status(404)
          .json({ error: 'NOT_FOUND' })
          .end()
      if (user.permissions.find(permission => permission.name === 'admin'))
        return res
          .status(400)
          .json({ error: 'ALREADY_ADMIN' })
          .end()
      let permission = await Permission.create({ name: 'admin' })
      await permission.setUser(user)
      return res
        .status(200)
        .json(user)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
