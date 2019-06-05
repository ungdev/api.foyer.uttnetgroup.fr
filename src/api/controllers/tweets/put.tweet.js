const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const log = require('../../utils/log')(module)
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

module.exports = app => {
  app.put('/tweets/:id', [
    check('visible')
      .optional()
      .isBoolean(),
    validateBody()
  ])
  app.put('/tweets/:id', [isAuth('tweet-modify'), isAdmin('tweet-modify')])
  app.put('/tweets/:id', async (req, res) => {
    const { Tweet } = app.locals.models
    try {
      let tweet = await Tweet.findByPk(req.params.id)
      await tweet.update(req.body)

      const tweets = await Tweet.findAll({ order: [['createdAt', 'DESC']] })
      app.locals.io.emit('tweets', tweets)

      log.info(`Tweet ${tweet.text} modified`)
      return res
        .status(200)
        .json(tweet)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
