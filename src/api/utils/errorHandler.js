const axios = require('axios')
module.exports = async (err, req, res) => {
  console.log(err)

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(400)
      .json({ error: 'DUPLICATE_ENTRY' })
      .end()
  }
  if (err.name === 'APIError' && err.status === 404) {
    return res
      .status(404)
      .json({ error: 'NOT_FOUND' })
      .end()
  }
  if (err.response && err.response.status === 403) {
    if (err.response.data && err.response.data.error === 'expired_token') {
      if (req.user) {
        try {
          console.log('REFRESHING')
          const token = req.user.refresh_token
          const result = await axios.get(
            `${process.env.ETU_BASEURL}/api/oauth/authorize?grant_type=refresh_token&refresh_token=${token}&scopes=${process.env.ETU_SCOPE}&client_id=${process.env.ETU_CLIENT_ID}&client_secret=${process.env.ETU_CLIENT_SECRET}&state=xyz`
          )
          console.log(result.data)
        } catch (e) {
          console.log(e)
        }
      }
    }
    return res
      .status(404)
      .json({ error: err.response.data.error })
      .end()
  }

  return res
    .status(500)
    .json({ error: 'UNKNOWN' })
    .end()
}
