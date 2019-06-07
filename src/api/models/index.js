module.exports = function(sequelize) {
  const Orga = sequelize.import(`${__dirname}/orga`)
  const Perm = sequelize.import(`${__dirname}/perm`)
  const Permission = sequelize.import(`${__dirname}/permission`)
  const Tweet = sequelize.import(`${__dirname}/tweet`)
  const User = sequelize.import(`${__dirname}/user`)
  const UserOrga = sequelize.import(`${__dirname}/userOrga`)
  const UserPerm = sequelize.import(`${__dirname}/userPerm`)

  Permission.belongsTo(User)
  User.hasMany(Permission)

  User.belongsToMany(Orga, { through: UserOrga, as: 'Assos' })
  Orga.belongsToMany(User, { through: UserOrga, as: 'Members' })

  User.belongsToMany(Perm, { through: UserPerm, as: 'Perms' })
  Perm.belongsToMany(User, { through: UserPerm, as: 'Members' })

  Orga.belongsTo(Perm)
  Perm.hasMany(Orga)

  return {
    Orga,
    Permission,
    Perm,
    Tweet,
    User,
    UserOrga,
    UserPerm
  }
}
