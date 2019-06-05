const path = require('path')
const dotenv = require('dotenv')


const localConfig = dotenv.config({
  path: path.join(__dirname, '..', '.env.local')
})
module.exports = localConfig.parsed
  ? Object.assign({}, process.env, localConfig.parsed)
  : process.env
