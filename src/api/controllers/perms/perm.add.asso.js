const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

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
    const { Perm, Orga } = app.locals.models
    try {
      const { login } = req.body
      const perm = await Perm.findByPk(req.params.id, { include: [Orga] })
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
      perm.addOrga(asso)
      return res
        .status(200)
        .json(perm)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
