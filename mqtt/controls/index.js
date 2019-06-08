// gameId와 event를 받고
// event에 따라 Mongoose 모델 조작
// 조작 완료 후 달라진 내용을 publish
  // /update/gameId /w { event }

// 조작할 것: gameId에 대응하는 game model
// signature: (client: MQTT_instance, gameId: String, event: Number)
const Game = require('../../schemas/game')
const controller = (client, gameId, eventCode) => {
  console.log('controller')
  console.log(eventCode)
  switch (eventCode) {
    case 0:
      Game.findByIdAndUpdate({ _id: gameId }, { state: 0 }, null, (err) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: 'update successful',
            event: 0
          }))
        }
      })
      break

    case 1:
      break

    case 2:
      break

    case 3:
      break

    case 4:
      break

    case 5:
      break

    case 6:
      break

    case 7:
      break

    default:

  }
}

module.exports = controller
