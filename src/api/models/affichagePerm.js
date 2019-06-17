module.exports = (sequelize, DataTypes) => {
  return sequelize.define('affichagePerm', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })
}
