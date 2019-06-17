module.exports = function(sequelize) {
  const Affichage = sequelize.import(`${__dirname}/affichage`)
  const AffichagePerm = sequelize.import(`${__dirname}/affichagePerm`)
  const Orga = sequelize.import(`${__dirname}/orga`)
  const Parameter = sequelize.import(`${__dirname}/parameter`)
  const Perm = sequelize.import(`${__dirname}/perm`)
  const Permission = sequelize.import(`${__dirname}/permission`)
  const Tweet = sequelize.import(`${__dirname}/tweet`)
  const User = sequelize.import(`${__dirname}/user`)
  const UserOrga = sequelize.import(`${__dirname}/userOrga`)
  const UserPerm = sequelize.import(`${__dirname}/userPerm`)

  Permission.belongsTo(User)
  User.hasMany(Permission)

  Affichage.belongsTo(Orga)
  Orga.hasMany(Affichage)

  Affichage.belongsToMany(Perm, { through: AffichagePerm, as: 'perms' })
  Perm.belongsToMany(Affichage, { through: AffichagePerm, as: 'affichages' })

  User.belongsToMany(Orga, { through: UserOrga, as: 'assos' })
  Orga.belongsToMany(User, { through: UserOrga, as: 'members' })

  User.belongsToMany(Perm, { through: UserPerm, as: 'perms' })
  Perm.belongsToMany(User, { through: UserPerm, as: 'members' })

  Orga.belongsTo(Perm)
  Perm.hasMany(Orga)

  return {
    Affichage,
    AffichagePerm,
    Orga,
    Parameter,
    Permission,
    Perm,
    Tweet,
    User,
    UserOrga,
    UserPerm
  }
}
