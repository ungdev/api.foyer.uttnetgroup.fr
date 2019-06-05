const Sequelize = require('sequelize')
const modelsFactory = require('./api/models')
const env = require('./env')
const log = require('./api/utils/log')(module)

module.exports = async function database() {
  const database = `${env.DB_TYPE}://${env.DB_USER}:${env.DB_PASSWORD}@${
    env.DB_HOST
  }:${env.DB_PORT}/${env.DB_NAME}`
  log.info(
    `Trying to connect to database : ${env.DB_TYPE}://******:******@${
      env.DB_HOST
    }:${env.DB_PORT}/${env.DB_NAME}`
  )
  const sequelize = new Sequelize(database, {
    operatorsAliases: Sequelize.Op,
    logging: sql => log.debug(sql),
    define: {
      charset: 'utf8mb4'
    }
  })
  sequelize.query("SET NAMES utf8mb4;");
  process.on('SIGINT', async function() {
    try {
      await sequelize.close()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })

  try {
    const models = modelsFactory(sequelize)

    await sequelize.sync()

    log.info('connected to database')

    return { sequelize, models }
  } catch (err) {
    throw err
  }
}
