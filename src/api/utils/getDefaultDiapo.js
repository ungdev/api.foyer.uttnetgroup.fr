module.exports = async app => {
  let orgas = await app.locals.models.Orga.findAll()
  orgas = orgas.filter(orga => orga.diapoImage)
  return orgas.map(orga => orga.diapoImage)
}