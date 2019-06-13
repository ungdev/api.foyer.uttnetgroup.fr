const errorHandler = require('../../utils/errorHandler')

module.exports = app => {
  app.get('/logos', async (req, res) => {
    const { Orga } = app.locals.models
    try {
      const orgas = await Orga.findAll()
      return res
        .status(200)
        .json(
          orgas
            .filter(orga => orga.image !== '/uploads/logos/default-logo.png')
            .filter(orga => orga.displayImage)
            .map(orga => orga.image)
        )
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
