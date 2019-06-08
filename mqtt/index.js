const mqtt = (app) => {
  const mqtt = require('mqtt')
  const mqttParse = require('mqtt-pattern')
  const client = mqtt.connect(`mqtt://${process.env.BROKER_IP}:${process.env.BROKER_PORT}`)
  const controller = require('./controls')

  client.on('connect', (connack) => {
    console.log(`MQTT Broker와 연결 성공`)
    // 처음 디바이스를 등록했을 때에 해당 디바이스에 대한 고유 번호를 얻어올 필요가 있다.
    // 그래야 위변조에 대한 대책을 세울 수 있을 듯
    // 아니면, 패스워드가 일치해야만 하도록?

    // 정보: 디바이스에서는 버튼 이외의 다른 프로그래밍적 조작이 불가

    // 결론: 어차피 악의의 디바이스로부터 조작이 있다고 하면
    // 바로 현장의 사람들에 의하여 들통나므로
    // 딱히 그럴 필요는 없어보임
    // 단, REST 클라이언트에 의한 수정은 검열해야할듯

    client.subscribe('/event/#', (err) => {
      // if (!err) client.publish('/123/34/dd/sss', JSON.stringify({
      //   msg: 'hi!'
      // }))
      client.publish('/event/5ce78a7de73c2f3660a992e8', JSON.stringify({
        eventCode: 0
      }))
    })
  })

  client.on('message', (topic, message) => {
    // 토픽에 들어있는 경기 id를 기반으로 데이터 수정
    // const topicPattern = '/+competId/+gameId/#'
    // const topics = mqttParse.exec(topicPattern, topic)
    // console.dir(topics)
    // console.dir(JSON.parse(message.toString()))
    const topicPattern = '/event/+gameId/#'
    const topics = mqttParse.exec(topicPattern, topic)

    if (Object.keys(topics).includes('gameId')) {
      const { eventCode } = JSON.parse(message.toString())
      if (eventCode !== undefined) controller(client, topics.gameId, eventCode)
    }
  })
  // save the reference of this mqtt client
  // so that later `Just In Case` in REST APIs we can publish any message
  app.set('mqtt', client)
}

module.exports = mqtt
