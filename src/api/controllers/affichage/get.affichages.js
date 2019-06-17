const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

module.exports = app => {
  app.get('/affichages', [isAuth('asso-affichage-all')])
  app.get('/affichages', async (req, res) => {
    try {
      const { Orga, Affichage } = app.locals.models
      let affichages = await Affichage.findAll({ include: [Orga] })
      
      return res
        .status(200)
        .json(affichages)
        .end()
    } catch (err) {
      errorHandler(err, req, res)
    }
  })
}
