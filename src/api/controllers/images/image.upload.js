const errorHandler = require('../../utils/errorHandler')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { promisify } = require('util')
jwt.verify = promisify(jwt.verify)
const log = require('../../utils/log')(module)
const multer = require('multer')
const storage = multer.diskStorage({
  destination: './temp/',
  filename: async (req, file, cb) => {
    const { User, Permission } = req.app.locals.models
    const { auth } = req.body
    if (!auth || auth.length === 0) {
      log.warn('missing token')

      cb('NO_TOKEN', null)
    }
    const token = auth.split('Basic ')[1]
    if (!token || auth.token === 0) {
      log.warn('missing token')

      cb('NO_TOKEN', null)
    }
    try {
      const decoded = await jwt.verify(token, process.env.API_SECRET)

      const user = await User.findByPk(decoded.id, { include: [Permission] })
      if (!user) {
        log.warn('invalid token : user not found')
        cb('INVALID_TOKEN', null)
        return
      }

      if (!user.permissions.find(p => p.name === 'admin')) {
        log.warn('Tryed to upload an image but is not admin')
        cb('NOT_ADMIN', null)
        return
      }
      const filename =
        moment().format() +
        '_' +
        file.originalname

      cb(null, filename)
    } catch (err) {
      log.warn('invalid token')

      cb('INVALID_TOKEN', null)
    }
  }
})
const upload = multer({ storage }).single('file')
/**
 * POST /images
 *
 * Body :
 *
 * { auth, name }
 *
 */
module.exports = app => {
  app.post('/images', async (req, res) => {
    try {
      upload(req, res, async error => {
        if (error) {
          return res
            .status(400)
            .json({ error })
            .end()
        } else {
          return res.status(200).end()
        }
      })
    } catch (e) {
      errorHandler(e)
    }
  })
}
