const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

module.exports = app => {
  app.get('/users', [isAuth('users-get'), isAdmin('users-get')])
  app.get('/users', async (req, res) => {
    const { User, Permission } = app.locals.models
    try {
      let users = await User.findAll({ include: [Permission] })
      users = users.map(user => {
        let { permissions } = user
        if (permissions) permissions = permissions.map(p => p.name)
        return {
          id: user.id,
          full_name: user.full_name,
          permissions
        }
      })

      return res
        .status(200)
        .json(users)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
