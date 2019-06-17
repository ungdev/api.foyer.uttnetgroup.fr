const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const path = require('path')
const fs = require('fs')
const updateDiapo = require('../../utils/updateDiapo')
const updateLogos = require('../../utils/updateLogos')

module.exports = app => {
  app.post('/assos/:id/affichages', [
    check('title')
      .optional()
      .isString(),
    check('text')
      .optional()
      .isString(),
    check('image')
      .optional()
      .isString(),
    validateBody()
  ])
  app.post('/assos/:id/affichages', [isAuth('asso-affichage')])
  app.post('/assos/:id/affichages', async (req, res) => {
    try {
      const { Orga, Affichage } = app.locals.models
      let orga = await Orga.findByPk(req.params.id)
      if (!req.body.image && !req.body.text && !req.body.title) {
        return res
          .status(400)
          .json({ error: 'MISSING_PARAMS' })
          .end()
      }
      let affichage = await Affichage.create({
        title: req.body.title,
        text: req.body.text
      })
      await affichage.setOrga(orga)
      if (req.body.image && req.body.image !== '') {
        const files = fs.readdirSync(path.join(__dirname, '../../../../temp'))
        let file = files.find(f => f.indexOf(req.body.image) !== -1)
        const oldfile = path.join(__dirname, '../../../../temp', file)
        const newfile = path.join(__dirname, '../../../../images', file)
        fs.copyFileSync(oldfile, newfile)
        fs.unlinkSync(oldfile)
        affichage.image = '/images/' + file
      }
      await affichage.save()
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
