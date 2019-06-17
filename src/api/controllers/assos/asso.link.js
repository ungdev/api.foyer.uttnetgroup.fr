const errorHandler = require('../../utils/errorHandler')

module.exports = app => {
  app.get('/assos/:id/link', async (req, res) => {
    try {
      const { Orga } = app.locals.models
      const orga = await Orga.findByPk(req.params.id)
      return res
        .redirect(
          process.env.ETU_BASEURL + '/orgas/' + orga.login
        )
    } catch (err) {
      errorHandler(err, req, res)
    }
  })
}
