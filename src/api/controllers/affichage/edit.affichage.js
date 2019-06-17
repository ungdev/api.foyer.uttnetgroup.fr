const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const updateDiapo = require('../../utils/updateDiapo')
const updateLogos = require('../../utils/updateLogos')

module.exports = app => {
  app.put('/affichages/:id', [
    check('title')
      .optional()
      .isString(),
    check('text')
      .optional()
      .isString(),
    validateBody()
  ])
  app.put('/affichages/:id', [isAuth('edit-affichage')])
  app.put('/affichages/:id', async (req, res) => {
    try {
      const { Affichage } = app.locals.models
      let affichage = await Affichage.findByPk(req.params.id)
      await affichage.update(req.body)
      updateDiapo(app)
      updateLogos(app)
      return res
        .status(200)
        .json(affichage)
        .end()
    } catch (err) {
      errorHandler(err, req, res)
    }
  })
}
