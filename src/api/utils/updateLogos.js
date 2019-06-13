const moment = require('moment')

module.exports = async app => {
  const { io, models } = app.locals
  const { Orga, Perm } = models
  const day = getDay()
  const dayPerms = await Perm.findAll({ where: { day }, include: [Orga] })
  const perms = dayPerms
    .filter(perm => {
      //filter all perms that starts in the future
      let [hour, minute] = perm.start.split('h')
      return moment({ hour, minute }).isBefore()
    })
    .filter(perm => {
      //filter all perms that ends in the past
      let [hour, minute] = perm.end.split('h')
      return moment({ hour, minute }).isAfter()
    })
  if (perms.length > 0) {
    // there's a perm now
    const perm = perms[0] // if there's more than one perm, it's a bug
    if (perm.orgas.length > 0) {
      const logos = perm.orgas
        .filter(orga => orga.displayImage)
        .map(orga => orga.image)
      const foyer = await Orga.findOne({ where: { login: 'foyer' } })
      io.emit('logos', [foyer && foyer.image, ...logos])
    } else {
      const foyer = await Orga.findOne({ where: { login: 'foyer' } })
      const assos = await Orga.findAll()
      if (foyer)
        io.emit('logos', [
          foyer.image,
          ...assos
            .filter(asso => asso.login !== 'foyer')
            .filter(orga => orga.image !== '/uploads/logos/default-logo.png')
            .filter(orga => orga.displayImage)
            .map(asso => asso.image)
        ])
    }
  } else {
    // there's no perm now
    const foyer = await Orga.findOne({ where: { login: 'foyer' } })
    const assos = await Orga.findAll()
    if (foyer)
      io.emit('logos', [
        foyer.image,
        ...assos
          .filter(asso => asso.login !== 'foyer')
          .filter(orga => orga.image !== '/uploads/logos/default-logo.png')
          .filter(orga => orga.displayImage)
          .map(asso => asso.image)
      ])
  }
}

const getDay = () => {
  switch (moment().day()) {
    case 0:
      return 'Dimanche'
    case 1:
      return 'Lundi'
    case 2:
      return 'Mardi'
    case 3:
      return 'Mercredi'
    case 4:
      return 'Jeudi'
    case 5:
      return 'Vendredi'
    case 6:
      return 'Samedi'
    default:
      return 'Dimanche'
  }
}
