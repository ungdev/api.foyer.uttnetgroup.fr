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
    const { Perm, User, Orga, UserPerm } = app.locals.models
    try {
      const { login } = req.body
      const perm = await Perm.findByPk(req.params.id, {
        include: [Orga, { model: User, through: UserPerm, as: 'Members' }]
      })
      if (perm.orgas.length > 0) {
        return res
          .status(400)
          .json({ error: 'HAS_ORGAS' })
          .end()
      }
      if (perm.Members.find(etu => etu.login === login)) {
        return res
          .status(400)
          .json({ error: 'USER_ALREADY_IN_PERM' })
          .end()
      }
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
          student_id: user.studentId,
          image: user._links.find(link => link.rel === 'user.image').uri
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
