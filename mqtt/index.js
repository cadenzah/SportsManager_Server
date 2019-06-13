const mqtt = (app) => {
  const Game = require('../schemas/game')
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
        competitionId: '5ce7801c9cc806342dc493fa',
        deviceId: '9876'
      }))
    })
  })

  client.on('message', (topic, message) => {
    const connectTopics = mqttParse.exec('/+method', topic)
    const otherTopics = mqttParse.exec('/+method/+deviceId', topic)

    if (!otherTopics) {
      console.log(connectTopics)
      // connect topic
      const { deviceId, competitionId } = JSON.parse(message.toString())
      // 해당 deviceId와 competId 로 게임 만든다
      Game.find({ competition_id: competitionId }, (err, games) => {
        // 혹시나 서비스 상에 없는 경기인 경우
        if(err) return console.log(err)

        let court = 0;
        games.forEach((game) => {
          if(game.court > court) court = game.court;
        });
        court++;

        const body = {
          court,
          number: 0,
          state: 0,
          competition_id: competitionId,
          device_id: deviceId,
          team_A: {
            players: []
          },
          team_B: {
            players: []
          }
        }
        const newGame = new Game(body);
        newGame.save((err) => {
          if (err) console.error(err)
          else {
            client.subscribe(`/event/${deviceId}`, (err) => {
              client.publish(`/update/${deviceId}`, JSON.stringify({
                msg: 'game_ready',
                eventCode: 0
              }))
              // ## dummy '/event' publish code for test purpose
              client.publish(`/event/${deviceId}`, JSON.stringify({
                competId: '5ce7801c9cc806342dc493fa',
                eventCode: 2
              }))
            })
          }
        })
      });
    } else if (otherTopics.method === 'event'){
      console.log(otherTopics)
      // event topic
      const { competId, eventCode, content } = JSON.parse(message.toString())
      // competId, deviceId, eventCode, conetent
      if (eventCode !== undefined) controller(client, otherTopics.deviceId, competId, eventCode, content)

      // ## dummy '/update' subscribe code for test purpose
      client.subscribe(`/update/${otherTopics.deviceId}`)
    }
    // ## dummy '/update' processing condition branch
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
