const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const updateDiapo = require('../../utils/updateDiapo')
const updateLogos = require('../../utils/updateLogos')

module.exports = app => {
  app.delete('/perms/:id/affichages/:affichageId', [
    isAuth('affichage-remove-perm')
  ])
  app.delete('/perms/:id/affichages/:affichageId', async (req, res) => {
    const { Perm, Affichage } = app.locals.models
    try {
      const { id, affichageId } = req.params
      const perm = await Perm.findByPk(id)
      let affichage = await Affichage.findByPk(affichageId)
      if (!affichage || !perm)
        return res
          .status(404)
          .json({ error: 'NOT_FOUND' })
          .end()
      affichage.removePerms(perm)
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
