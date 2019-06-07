const errorHandler = require('../../utils/errorHandler')

module.exports = app => {
  app.get('/assos/:id/image', async (req, res) => {
    try {
      const { Orga } = app.locals.models
      const orga = await Orga.findByPk(req.params.id)
      return res
        .redirect(
          process.env.ETU_BASEURL + '/uploads/logos/' + orga.login + '.png'
        )
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
