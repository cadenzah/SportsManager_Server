// signature: (client: MQTT_instance, gameId: String, event: Number)
const Game = require('../../schemas/game')
const controller = (client, gameId, eventCode) => {
  switch (eventCode) {
    case 0: // device connected
      Game.findByIdAndUpdate({ _id: gameId }, { state: 'device_ready' }, null, (err) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: 'device_ready',
            event: 0
          }))
        }
      })
      break

    case 1: // game started
      Game.findByIdAndUpdate({ _id: gameId }, { state: 'in_progress' }, null, (err) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: 'in_progress',
            event: 1
          }))
        }
      })
      break

    case 2: // game done
      Game.findByIdAndUpdate({ _id: gameId }, { state: 'game_over' }, null, (err) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: 'game_over',
            event: 2
          }))
        }
      })
      break

    case 3: // team A scored
      Game.findByIdAndUpdate({ _id: gameId },
        { $inc: { 'team_A.score': 1 } },
        { new: true },
        (err, game) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: `team A scored - ${game.team_A.score}:${game.team_B.score}`,
            event: 3
          }))
        }
      })
      break

    case 4: // team B scored
      Game.findByIdAndUpdate({ _id: gameId },
        { $inc: { 'team_B.score': 1 } },
        { new: true },
        (err, game) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: `team B scored - ${game.team_A.score}:${game.team_B.score}`,
            event: 4
          }))
        }
      })
      break

    case 5: // team A deducted
      Game.findByIdAndUpdate({ _id: gameId },
        { $inc: { 'team_A.score': -1 } },
        { new: true },
        (err, game) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: `team A deducted - ${game.team_A.score}:${game.team_B.score}`,
            event: 5
          }))
        }
      })
      break

    case 6: // team B deducted
      Game.findByIdAndUpdate({ _id: gameId },
        { $inc: { 'team_B.score': -1 } },
        { new: true },
        (err, game) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: `team B deducted - ${game.team_A.score}:${game.team_B.score}`,
            event: 6
          }))
        }
      })
      break

    case 7: // other cases i.e. player wound, no shuttlecock, player not shown...
      Game.findByIdAndUpdate({ _id: gameId }, { state: 'problem' }, null, (err) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail')
          client.publish(`update/${gameId}`, JSON.stringify({
            msg: 'update failed',
            event: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success')
          client.publish(`/update/${gameId}`, JSON.stringify({
            msg: 'problem occured',
            event: 7
          }))
        }
      })
      break

    default: // event code is out of range; return error message
      client.publish(`/update/${gameId}`, JSON.stringify({
        msg: 'update failed - wrong event code (1 ~ 7)',
        event: eventCode
      }))
      break
  }
}

module.exports = controller
