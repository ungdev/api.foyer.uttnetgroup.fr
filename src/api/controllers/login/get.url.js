module.exports = app => {
  app.get('/etuutt/url', async (req, res) => {
    return res.redirect(
      `${
        process.env.ETU_BASEURL
      }/api/oauth/authorize?response_type=code&client_id=${
        process.env.ETU_CLIENT_ID
      }&scope=${process.env.ETU_SCOPE}&state=xyz`
    )
  })
}
