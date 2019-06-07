module.exports = (sequelize, DataTypes) => {
  return sequelize.define('userPerm', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  })
}
