const { check } = require('express-validator/check')
const oauth2 = require('simple-oauth2')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const log = require('../../utils/log')(module)
const validateBody = require('../../middlewares/validateBody')

module.exports = app => {
  app.get('/etuutt/redirect', [
    check('authorization_code').exists(),
    check('state').exists(),
    validateBody()
  ])

  app.get('/etuutt/redirect', async (req, res) => {
    const { User } = app.locals.models
    let token = ''
    try {
      // Create OAuth object
      const auth = oauth2.create({
        client: {
          id: process.env.ETU_CLIENT_ID,
          secret: process.env.ETU_CLIENT_SECRET
        },
        auth: {
          tokenHost: process.env.ETU_BASEURL,
          tokenPath: '/api/oauth/token',
          authorizePath: '/api/oauth/authorize'
        }
      })

      // Save access token
      const etu_token = await auth.authorizationCode.getToken({
        code: req.query.authorization_code
      })
      const accessToken = auth.accessToken.create(etu_token)

      // Retrieve user infos
      const res = await axios.get(
        `${process.env.ETU_BASEURL}/api/public/user/account`,
        {
          headers: { Authorization: `Bearer ${accessToken.token.access_token}` }
        }
      )
      const { studentId, fullName, login, _links } = res.data.data
      // Try to find the user
      let user = await User.findOne({
        where: {
          student_id: studentId
        }
      })

      if (user) {
        // Update user fields
        user.access_token = accessToken.token.access_token
        user.refresh_token = accessToken.token.refresh_token
        user.token_expires = accessToken.token.expires

        await user.save()
      } else {
        // Create new user in the db
        user = await User.create({
          full_name: fullName,
          student_id: studentId,
          login: login,
          access_token: accessToken.token.access_token,
          refresh_token: accessToken.token.refresh_token,
          token_expires: accessToken.token.expires,
          image: _links.find(link => link.rel === 'user.image').uri
        })
      }
      token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
        expiresIn: process.env.API_SECRET_EXPIRES
      })
    } catch (err) {
      log.error(err)
    }
    return res.redirect(
      `${process.env.LOGIN_REDIRECT_URL}/login?token=${token}`
    )
  })
}
