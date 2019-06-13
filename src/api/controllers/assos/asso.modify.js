const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const path = require('path')
const fs = require('fs')
const updateDiapo = require('../../utils/updateDiapo')
const updateLogos = require('../../utils/updateLogos')

module.exports = app => {
  app.put('/assos/:id', [
    check('diapoImage')
      .optional()
      .isString(),
    check('displayImage')
      .optional()
      .isBoolean(),
    validateBody()
  ])
  app.put('/assos/:id', [isAuth('edit-asso'), isAdmin('edit-asso')])
  app.put('/assos/:id', async (req, res) => {
    try {
      const { Orga } = app.locals.models
      let orga = await Orga.findByPk(req.params.id)
      if (req.body.diapoImage && req.body.diapoImage !== '') {
        const files = fs.readdirSync(path.join(__dirname, '../../../../temp'))
        let file = files.find(f => f.indexOf(req.body.diapoImage) !== -1)
        const oldfile = path.join(__dirname, '../../../../temp', file)
        const newfile = path.join(__dirname, '../../../../images', file)
        fs.copyFileSync(oldfile, newfile)
        fs.unlinkSync(oldfile)
        orga.diapoImage = '/images/' + file
      }
      if (req.body.diapoImage === '') {
        const files = fs.readdirSync(path.join(__dirname, '../../../../images'))
        let file = files.find(
          f => f.indexOf(orga.diapoImage.split('/images/')[1]) !== -1
        )
        const oldfile = path.join(__dirname, '../../../../images', file)
        fs.unlinkSync(oldfile)
        orga.diapoImage = null
      }
      if (req.body.displayImage !== undefined) {
        orga.displayImage = req.body.displayImage
      }
      await orga.save()
      updateDiapo(app)
      updateLogos(app)
      return res
        .status(200)
        .json(orga)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
