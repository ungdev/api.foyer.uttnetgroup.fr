module.exports = (err, req, res) => {
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
    return res
      .status(404)
      .json({ error: err.response.data.error })
      .end()
  }
  if (
    err.response &&
    err.response.data &&
    err.response.data.error === 'expired_token'
  ) {
    if (req.user) {
      let token = req.user.refresh_token
      return res.redirect(
        `${process.env.ETU_BASEURL}/api/oauth/authorize?grant_type=refresh_token&refresh_token=${token}&scopes=${process.env.ETU_SCOPE}&client_id=${process.env.ETU_CLIENT_ID}&client_secret=${process.env.ETU_CLIENT_SECRET}&state=xyz`
      )
    }
  }

  return res
    .status(500)
    .json({ error: 'UNKNOWN' })
    .end()
}
