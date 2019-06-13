const errorHandler = require('../../utils/errorHandler')

module.exports = app => {
  app.get('/spotify/url', async (req, res) => {
    try {
      var scopes = 'user-read-currently-playing'
      const link =
        'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' +
        process.env.SPOTIFY_ID +
        '&scope=' +
        encodeURIComponent(scopes) +
        '&redirect_uri=' +
        encodeURIComponent(process.env.API_HOST + '/api/v1/spotify/redirect/')
      console.log('LINK', link)
      return res.redirect(link)
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
