module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'tweet',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userName: {
        type: DataTypes.STRING
      },
      visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      charset: 'utf8mb4'
    }
  )
}
