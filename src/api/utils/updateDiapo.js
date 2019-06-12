const moment = require('moment')
const getDefaultDiapo = require('./getDefaultDiapo')

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
      const diapos = perm.orgas
        .filter(orga => orga.diapoImage)
        .map(orga => orga.diapoImage)
      const affiches = [] //TODO GET ORGA AFFICHES
      io.emit('diapoImages', [...diapos, ...affiches])
    } else {
      const images = await getDefaultDiapo(app)
      io.emit('diapoImages', images)
    }
  } else {
    // there's no perm now
    const images = await getDefaultDiapo(app)
    io.emit('diapoImages', images)
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
