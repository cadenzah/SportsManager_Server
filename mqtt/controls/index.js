// signature: (client: MQTT_instance, deviceId: String, gameId: String, event: Number, content: String)
const Game = require('../../schemas/game')
const controller = (client, deviceId, competId, eventCode, content) => {
  switch (eventCode) {
    // case 0: // device connected
    //   Game.findByIdAndUpdate({ _id: gameId }, { state: 'device_ready' }, null, (err) => {
    //     if (err) { // 업데이트에 실패하였음을 publish
    //       console.log('fail-0')
    //       client.publish(`/update/${deviceId}`, JSON.stringify({
    //         gameId,
    //         msg: 'update_failed',
    //         eventCode: -1
    //       }))
    //     } else { // 정상 변경되었음을 publish
    //       console.log('success-0')
    //       client.publish(`/update/${deviceId}`, JSON.stringify({
    //         gameId,
    //         msg: 'device_ready',
    //         eventCode: 0
    //       }))
    //     }
    //   })
    //   break

    case 1: // game started
      Game.findOneAndUpdate({ device_id: deviceId }, { state: 1 }, null, (err) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail-1')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            gameId,
            msg: 'update_failed',
            eventCode: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success-1')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            gameId,
            msg: 'in_progress',
            eventCode: 1
          }))
        }
      })
      break

    case 2: // game done
      Game.findOneAndUpdate({ device_id: deviceId },
        {
          state: 2,
          team_A: { score: 0 },
          team_B: { score: 0 },
          $inc: { 'number': 1 }
        }, null, (err) => {
        if (err) { // 업데이트에 실패하였음을 publish
          // console.log('fail-2')
          console.error(err)
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: 'update_failed',
            eventCode: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success-2')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: 'game_over',
            eventCode: 2
          }))
        }
      })
      break

    case 3: // team A scored
      Game.findOneAndUpdate({ device_id: deviceId },
        { $inc: { 'team_A.score': 1 } },
        { new: true },
        (err, game) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail-3')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: 'update_failed',
            eventCode: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success-3')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: `team_A_scored_${game.team_A.score}:${game.team_B.score}`,
            eventCode: 3
          }))
        }
      })
      break

    case 4: // team B scored
      Game.findOneAndUpdate({ device_id: deviceId },
        { $inc: { 'team_B.score': 1 } },
        { new: true },
        (err, game) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail-4')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: 'update_failed',
            eventCode: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success-4')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: `team_B_scored_${game.team_A.score}:${game.team_B.score}`,
            eventCode: 4
          }))
        }
      })
      break

    case 5: // team A deducted
      Game.findOneAndUpdate({ device_id: deviceId },
        { $inc: { 'team_A.score': -1 } },
        { new: true },
        (err, game) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail-5')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: 'update_failed',
            eventCode: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success-5')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: `team_A_deducted_${game.team_A.score}:${game.team_B.score}`,
            eventCode: 5
          }))
        }
      })
      break

    case 6: // team B deducted
      Game.findOneAndUpdate({ device_id: deviceId },
        { $inc: { 'team_B.score': -1 } },
        { new: true },
        (err, game) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail-6')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: 'update_failed',
            eventCode: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success-6')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: `team_B_deducted_${game.team_A.score}:${game.team_B.score}`,
            eventCode: 6
          }))
        }
      })
      break

    case 7: // other cases i.e. player wound, no shuttlecock, player not shown...
      Game.findOneAndUpdate({ device_id: deviceId }, { state: content }, null, (err) => {
        if (err) { // 업데이트에 실패하였음을 publish
          console.log('fail-7')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: 'update_failed',
            eventCode: -1
          }))
        } else { // 정상 변경되었음을 publish
          console.log('success-7')
          client.publish(`/update/${deviceId}`, JSON.stringify({
            msg: content,
            eventCode: 7
          }))
        }
      })
      break

    default: // event code is out of range; return error message
      console.log('fail-default')
      client.publish(`/update/${deviceId}`, JSON.stringify({
        msg: 'update_failed_wrong_event_code_(1~7)',
        eventCode: eventCode
      }))
      break
  }
}

module.exports = controller
