const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const axios = require('axios')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

module.exports = app => {
  app.get('/etus', [
    check('search')
      .optional()
      .isString(),
    validateBody()
  ])
  app.get('/etus', [isAuth('get-etus')])
  app.get('/etus', async (req, res) => {
    try {
      const { search } = req.query
      const result = await axios.get(
        `${process.env.ETU_BASEURL}/api/public/users?multifield=${search}&is_student=true`,
        {
          headers: { Authorization: `Bearer ${req.user.access_token}` }
        }
      )
      return res
        .status(200)
        .json(result.data.data)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
