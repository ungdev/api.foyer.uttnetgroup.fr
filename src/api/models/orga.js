module.exports = (sequelize, DataTypes) => {
  return sequelize.define('orga', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    diapoImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    displayImage: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })
}
