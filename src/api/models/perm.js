module.exports = (sequelize, DataTypes) => {
  return sequelize.define('perm', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    day: { type: DataTypes.STRING, allowNull: false },
    start: { type: DataTypes.STRING, allowNull: false },
    end: { type: DataTypes.STRING, allowNull: false }
  })
}
