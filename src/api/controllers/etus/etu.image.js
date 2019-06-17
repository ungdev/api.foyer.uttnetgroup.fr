const errorHandler = require('../../utils/errorHandler')

module.exports = app => {
  app.get('/etus/:id/image', async (req, res) => {
    try {
      const { User } = app.locals.models
      const user = await User.findByPk(req.params.id)
      return res.redirect(process.env.ETU_BASEURL + user.image)
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
