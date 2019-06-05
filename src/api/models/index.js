module.exports = function(sequelize) {
  const Orga = sequelize.import(`${__dirname}/orga`)
  const Permission = sequelize.import(`${__dirname}/permission`)
  const Tweet = sequelize.import(`${__dirname}/tweet`)
  const User = sequelize.import(`${__dirname}/user`)
  const UserOrga = sequelize.import(`${__dirname}/userOrga`)



  Permission.belongsTo(User)
  User.hasMany(Permission)

  User.belongsToMany(Orga, { through: UserOrga, as: 'RequestedTeam' })
  Orga.belongsToMany(User, { through: UserOrga, as: 'AskingUser' })


  return {
    Orga,
    Permission,
    Tweet,
    User,
    UserOrga
  }
}
