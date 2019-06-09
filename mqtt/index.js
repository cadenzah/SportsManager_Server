const mqtt = (app) => {
  const mqtt = require('mqtt')
  const mqttParse = require('mqtt-pattern')

  const brokerIP = process.env.BROKER_IP || 'localhost'
  const brokerPort = process.env.BROKER_PORT || 1883

  const client = mqtt.connect(`mqtt://${brokerIP}:${brokerPort}`)
  const controller = require('./controls')

  client.on('connect', (connack) => {
    console.log(`${brokerPort}번 포트에서 MQTT Broker와 연결 성공`)

    // test codes to simulate event from device
    client.subscribe('/event/#', (err) => {
      client.publish('/event/5ce78a7de73c2f3660a992e8', JSON.stringify({
        eventCode: 13
      }))
    })

    // test codes to subscribe the update made by server
    client.subscribe('/update/#')
  })

  client.on('message', (topic, message) => {
    const topicPattern = '/event/+gameId/#'
    const topics = mqttParse.exec(topicPattern, topic)

    if (!!topics && Object.keys(topics).includes('gameId')) {
      const { eventCode } = JSON.parse(message.toString())
      if (eventCode !== undefined) controller(client, topics.gameId, eventCode)
    } else {
      console.log(JSON.parse(message.toString()))
    }
  })
  // save the reference of this mqtt client
  // so that later `Just In Case` in REST APIs we can publish any message
  app.set('mqtt', client)
}

module.exports = mqtt
