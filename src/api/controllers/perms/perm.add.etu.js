const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const axios = require('axios')

module.exports = app => {
  app.post('/perms/:id/etus', [
    check('login')
      .exists()
      .isString(),
    validateBody()
  ])
  app.post('/perms/:id/etus', [isAuth('perm-add-etu'), isAdmin('perm-add-etu')])
  app.post('/perms/:id/etus', async (req, res) => {
    const { Perm, User } = app.locals.models
    try {
      const { login } = req.body
      const perm = await Perm.findByPk(req.params.id)
      let etu = await User.findOne({ where: { login } })
      if (!etu) {
        const result = await axios.get(
          `${process.env.ETU_BASEURL}/api/public/users/${login}`,
          {
            headers: { Authorization: `Bearer ${req.user.access_token}` }
          }
        )
        const user = result.data.data
        etu = await User.create({
          login,
          full_name: user.fullName,
          student_id: user.studentId
        })
      }
      perm.addMembers(etu)
      return res
        .status(200)
        .json(etu)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
