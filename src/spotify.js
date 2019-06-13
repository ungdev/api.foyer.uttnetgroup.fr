const axios = require('axios')
const pick = require('lodash.pick')
const btoa = require('btoa')
var https = require('https')
var querystring = require('querystring')

module.exports = app => {
  setInterval(() => fetchSpotify(app), process.env.SPOTIFY_REFRESH_SPEED || 5000)
}

const fetchSpotify = async app => {
  const { Parameter } = app.locals.models
  try {
    let access_token = await Parameter.findOne({
      where: { key: 'spotify_access_token' }
    })
    if (!access_token) return

    const song = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${access_token.value}`
        }
      }
    )
    app.locals.io.emit(
      'spotify',
      pick(song.data, ['is_playing', 'item', 'progress_ms'])
    )
  } catch (e) {
    if (e && e.response && e.response.data && e.response.data.error) {
      if (e.response.data.error.status === 401) {
        refreshToken(app)
      }
      console.log(e.response.data.error)
    } else console.log(e)
  }
}
const refreshToken = async app => {
  const { Parameter } = app.locals.models
  console.log('REFRESHING SPOTIFY TOKEN')
  const refreshToken = await Parameter.findOne({
    where: { key: 'spotify_refresh_token' }
  })
  const refresh_token = refreshToken.value
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
        setParameters(data.access_token, Parameter)
      })
      r.on('error', function(err) {
        console.log(err)
      })
    }
  )
  request.on('error', function(err) {
    console.log(err)
  })
  request.write(
    querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token
    })
  )
  request.end()
}

const setParameters = async (accessToken, Parameter) => {
  let access_token = await Parameter.findOne({
    where: { key: 'spotify_access_token' }
  })
  access_token.value = accessToken
  await access_token.save()
}
