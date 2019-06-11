const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

module.exports = app => {
  app.get('/perms', [isAuth('perms-get')])
  app.get('/perms', async (req, res) => {
    const { Perm, Orga, User, UserPerm } = app.locals.models
    try {
      const perms = await Perm.findAll({
        include: [Orga, { model: User, through: UserPerm, as: 'Members' }]
      })
      return res
        .status(200)
        .json(perms)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
