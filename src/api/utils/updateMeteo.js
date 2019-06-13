const axios = require('axios')
const moment = require('moment')
module.exports = async app => {
  const { io } = app.locals
  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=48.270&lon=4.065&units=metric&appid=${process.env.OPEN_WEATHER_APP_ID}`
    )
    let { list } = result.data
    list = list.filter(
      w =>
        moment(w.dt * 1000).format('HHmm') > 799 &&
        moment(w.dt * 1000).format('HHmm') < 2201
    )
    const data = list.map(w => ({
      time: w.dt * 1000,
      temp: w.main.temp,
      weather: w.weather
    }))
    io.emit('weather', [data[0], data[1], data[2]])
  } catch (e) {
    console.log(e)
  }
}
