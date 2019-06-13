const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const errorHandler = require('../../utils/errorHandler')
const btoa = require('btoa')
const https = require('https')
const querystring = require('querystring')

module.exports = app => {
  app.get('/spotify/redirect', [
    check('code').optional(),
    check('error').optional(),
    validateBody()
  ])

  app.get('/spotify/redirect', async (req, res) => {
    const { Parameter } = app.locals.models
    try {
      if (req.params.error) {
        console.log('SPOTIFY ERROR :', req.params.error)
        return res.redirect(`${process.env.LOGIN_REDIRECT_URL}/spotify/error`)
      }

      const request = https.request(
        {
          host: 'accounts.spotify.com',
          port: 443,
          method: 'POST',
          path: '/api/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(
              `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
            )}`
          }
        },
        r => {
          let result = ''
          r.on('data', function(chunk) {
            result += chunk
          })
          r.on('end', function() {
            const data = JSON.parse(result)
            setParameters(data.access_token, data.refresh_token, Parameter)
            return res.redirect(process.env.LOGIN_REDIRECT_URL + '/spotify')
          })
          r.on('error', function(err) {
            console.log(err)
            return res.redirect(
              `${process.env.LOGIN_REDIRECT_URL}/spotify/error`
            )
          })
        }
      )
      request.on('error', function(err) {
        console.log(err)
        return res.redirect(`${process.env.LOGIN_REDIRECT_URL}/spotify/error`)
      })
      request.write(
        querystring.stringify({
          grant_type: 'authorization_code',
          code: req.query.code,
          redirect_uri: process.env.API_HOST + '/api/v1/spotify/redirect/',
          client_id: process.env.SPOTIFY_ID,
          client_secret: process.env.SPOTIFY_SECRET
        })
      )
      request.end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}

const setParameters = async (accessToken, refreshToken, Parameter) => {
  let access_token = await Parameter.findOne({
    where: { key: 'spotify_access_token' }
  })
  if (!access_token)
    await Parameter.create({ key: 'spotify_access_token', value: accessToken })
  else {
    access_token.value = accessToken
    await access_token.save()
  }
  let refresh_token = await Parameter.findOne({
    where: { key: 'spotify_refresh_token' }
  })
  if (!refresh_token)
    await Parameter.create({
      key: 'spotify_refresh_token',
      value: refreshToken
    })
  else {
    refresh_token.value = refreshToken
    await refresh_token.save()
  }
}
