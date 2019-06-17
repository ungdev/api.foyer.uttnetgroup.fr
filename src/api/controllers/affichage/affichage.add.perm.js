const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const updateDiapo = require('../../utils/updateDiapo')
const updateLogos = require('../../utils/updateLogos')

module.exports = app => {
  app.post('/perms/:id/affichages', [
    check('affichageId')
      .exists()
      .isString(),
    validateBody()
  ])
  app.post('/perms/:id/affichages', [isAuth('perm-add-asso')])
  app.post('/perms/:id/affichages', async (req, res) => {
    const { Perm, Affichage } = app.locals.models
    try {
      const { affichageId } = req.body
      const perm = await Perm.findByPk(req.params.id)
      const affichage = await Affichage.findByPk(affichageId)

      await affichage.addPerms(perm)
      updateDiapo(app)
      updateLogos(app)
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, req, res)
    }
  })
}
