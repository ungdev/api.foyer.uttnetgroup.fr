const errorHandler = require('../../utils/errorHandler')
const path = require('path')
const fs = require('fs')
/**
 * GET /images/:name
 *
 */
module.exports = app => {
  app.get('/images/:name', async (req, res) => {
    try {
      const files = fs.readdirSync(path.join(__dirname, '../../../../images'))
      let file = files.find(f => f.indexOf(req.params.name) !== -1)
      res.sendFile(path.join(__dirname, '../../../../images', file))
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
