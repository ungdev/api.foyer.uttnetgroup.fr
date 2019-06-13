const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const updateDiapo = require('../../utils/updateDiapo')
const updateLogos = require('../../utils/updateLogos')

module.exports = app => {
  app.post('/perms/:id/assos', [
    check('login')
      .exists()
      .isString(),
    validateBody()
  ])
  app.post('/perms/:id/assos', [
    isAuth('perm-add-asso'),
    isAdmin('perm-add-asso')
  ])
  app.post('/perms/:id/assos', async (req, res) => {
    const { Perm, Orga, User, UserPerm } = app.locals.models
    try {
      const { login } = req.body
      const perm = await Perm.findByPk(req.params.id, {
        include: [Orga, { model: User, through: UserPerm, as: 'Members' }]
      })
      if (perm.Members.length > 0) {
        return res
          .status(400)
          .json({ error: 'HAS_MEMBERS' })
          .end()
      }
      if (perm.orgas.find(orga => orga.login === login)) {
        return res
          .status(400)
          .json({ error: 'ASSO_ALREADY_IN_PERM' })
          .end()
      }
      let asso = await Orga.findOne({ where: { login } })
      if (!asso) {
        const result = await axios.get(
          `${process.env.ETU_BASEURL}/api/public/orgas/${login}`,
          {
            headers: { Authorization: `Bearer ${req.user.access_token}` }
          }
        )
        asso = await Orga.create({
          login,
          name: result.data.data.name
        })
      }
      await perm.addOrga(asso)
      updateDiapo(app)
      updateLogos(app)
      return res
        .status(200)
        .json(perm)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
