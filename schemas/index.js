 /*
  * Generating connection with mongoose
  * this module will be exported as a form of function
  * once it is excuted, it will generate new connection to MongoDB and keep connection
  * if any error occurs or connection is lost, `mongoose` will try to re-connect
  */

const mongoose = require('mongoose')

module.exports = (dbPort) => {
  const connect = () => {
    mongoose.set('debug', true)
    mongoose.connect(`mongodb://root@localhost:${dbPort}`, {
      dbName: 'sports-manager'
    }, (error) => {
      if (error) {
        console.log('MongoDB 연결 에러', error)
      } else {
        console.log('MongoDB 연결 성공')
      }
    })
  }

  connect()

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB 연결 에러', error)
  });
  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB 연결이 끊겼습니다. 연결을 재시도합니다.')
    connect()
  })
}
