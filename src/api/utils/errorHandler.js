module.exports = (err, res) => {
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
  if (err.response.status === 403) {
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
