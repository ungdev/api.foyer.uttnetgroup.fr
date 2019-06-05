const errorHandler = require('../../utils/errorHandler')
const path = require('path')
const fs = require('fs')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
/**
 * DELETE /images/temp/:name
 *
 */
module.exports = app => {
  app.delete('/images/temp/:name', [
    isAuth('temp-image-delete'),
    isAdmin('temp-image-delete')
  ])
  app.delete('/images/temp/:name', async (req, res) => {
    try {
      let files = fs.readdirSync(path.join(__dirname, '../../../../temp'))
      let file = files.find(f => f.indexOf(req.params.name) !== -1)
      if (file) {
        fs.unlinkSync(path.join(__dirname, '../../../../temp', file))
        return res
          .status(200)
          .json('OK')
          .end()
      } else {
        files = fs.readdirSync(path.join(__dirname, '../../../../images'))
        file = files.find(f => f.indexOf(req.params.name) !== -1)
        if (file)
          return res
            .status(200)
            .json('NOT_TEMP')
            .end()
      }
      return res
        .status(404)
        .json({ error: 'NOT_FOUND' })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
