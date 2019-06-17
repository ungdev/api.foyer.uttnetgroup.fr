module.exports = (sequelize, DataTypes) => {
  return sequelize.define('affichage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    text: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    }
  })
}
