const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

module.exports = app => {
  app.delete('/etus/:id/etus/:login', [
    isAuth('perm-remove-etu'),
    isAdmin('perm-remove-etu')
  ])
  app.delete('/perms/:id/etus/:login', async (req, res) => {
    const { Perm, User } = app.locals.models
    try {
      const { id, login } = req.params
      const perm = await Perm.findByPk(id)
      let etu = await User.findOne({ where: { login } })
      if (!perm || !etu)
        return res
          .status(404)
          .json({ error: 'NOT_FOUND' })
          .end()
      perm.removeMembers(etu)
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, req, res)
    }
  })
}
