const Twitter = require('twitter')

module.exports = app => {
  const { Tweet } = app.locals.models
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })
  const stream = client.stream('statuses/filter', {
    track: `#${process.env.HASHTAG}`
  })

  stream.on('data', async event => {
    event.text = event.text.replace('&gt;', '>').replace('&lt;', '<')
    
    console.log(
      `Message en provenance de ${event.user.name} ${
        event.user.screen_name
      }: "${event.text}"`
    )
    await Tweet.create({
      user: event.user.screen_name,
      userName: event.user.name,
      text: event.text,
      visible: true
    })
    const tweets = await Tweet.findAll({ order: [['createdAt', 'DESC']] })
      app.locals.io.emit('tweets', tweets)
  })

  stream.on('error', function(error) {
    console.log('Twitter error :')
    console.log(error)
  })
  console.log('TWITTER SUCCESSFULLY SETUP')
}
