const mqtt = (app) => {
  const mqtt = require('mqtt')
  const mqttParse = require('mqtt-pattern')

  const brokerIP = process.env.BROKER_IP || 'localhost'
  const brokerPort = process.env.BROKER_PORT || 1883

  const client = mqtt.connect(`mqtt://${brokerIP}:${brokerPort}`)
  const controller = require('./controls')

  client.on('connect', (connack) => {
    console.log(`${brokerPort}번 포트에서 MQTT Broker와 연결 성공`)

    // subscribe to any mqtt messsage with topic '/connect'
    client.subscribe('/connect/#', (err) => {
      // dummy '/connect' publish code for test purpose
      client.publish('/connect', JSON.stringify({
        // deviceId (generated from the device)
        content: '12343'
      }))
    })
  })

  client.on('message', (topic, message) => {
    const connectTopics = mqttParse.exec('/+method', topic)
    const otherTopics = mqttParse.exec('/+method/+deviceId', topic)

    if (!otherTopics) {
      // connect topic
      const deviceId = JSON.parse(message.toString()).content
      client.subscribe(`/event/${deviceId}`)

      // dummy '/event' publish code for test purpose
      client.publish(`/event/${deviceId}`, JSON.stringify({
        gameId: '5ce78ccf6917da36bad81aa7',
        eventCode: 2
      }))
    } else if (otherTopics.method === 'event'){
      // event topic
      const { gameId, eventCode, content } = JSON.parse(message.toString())
      if (eventCode !== undefined) controller(client, otherTopics.deviceId, gameId, eventCode, content)

      // dummy '/update' subscribe code for test purpose
      client.subscribe(`/update/${otherTopics.deviceId}`)
    }
    // dummy '/update' processing condition branch
    else if (otherTopics.method === 'update') {
      console.log(JSON.parse(message.toString()))
    }
    else {
      console.log('nothing happened...')
    }
  })
  // save the reference of this mqtt client
  // so that later `Just In Case` in REST APIs we can publish any message
  app.set('mqtt', client)
}

module.exports = mqtt
