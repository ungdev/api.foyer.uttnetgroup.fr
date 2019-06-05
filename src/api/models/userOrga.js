module.exports = (sequelize, DataTypes) => {
  return sequelize.define('userOrga', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  })
}
