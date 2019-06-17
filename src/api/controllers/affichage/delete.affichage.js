const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const updateDiapo = require('../../utils/updateDiapo')
const updateLogos = require('../../utils/updateLogos')

module.exports = app => {
  app.delete('/affichages/:id', [isAuth('delete-affichage')])
  app.delete('/affichages/:id', async (req, res) => {
    try {
      const { Affichage } = app.locals.models
      let affichage = await Affichage.findByPk(req.params.id)
      await affichage.destroy()
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
