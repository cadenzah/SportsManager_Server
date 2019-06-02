const mqtt = () => {
  const mqtt = require('mqtt')
  const mqttParse = require('mqtt-pattern')
  const client = mqtt.connect(`mqtt://${process.env.BROKER_IP}:${process.env.BROKER_PORT}`)

  client.on('connect', () => {
    client.subscribe('/#', (err) => {
      if (!err) client.publish('/123/34/dd/sss', JSON.stringify({
        msg: 'hi!'
      }))
      else console.error(err)
    })
  })

  client.on('message', (topic, message) => {
    const topicPattern = '/+competId/+gameId/#'
    const topics = mqttParse.exec(topicPattern, topic)
    console.dir(topics)
    console.dir(JSON.parse(message.toString()))
  })
}

module.exports = mqtt()

/*

  Device 로부터
  /:competId/:gameId 로 오면
  => 대응하는 topic api 호출 + 데이터 함께 넘겨주기 (인자로; json)



*/
