const express = require('express')
const path = require('path')
const logger = require('morgan')
require('dotenv').config()

const port = process.env.PORT || 8080
const dbPort = process.env.DB_PORT || 27017
const connect = require('./schemas')

const app = express()
connect(dbPort)
const mqtt = require('./mqtt')
mqtt(app)

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routers separated in routes/ folder
const gameRouter = require('./routes/game.js')
const playerRouter = require('./routes/player.js')
const competitionRouter = require('./routes/competition.js')

app.use('/game', gameRouter)
app.use('/player', playerRouter)
app.use('/competition', competitionRouter)

// Other than the routings above, will get error message from the service

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.log(err)
  res.json({
    msg: "잘못된 경로의 접속입니다."
  })
});

app.listen(port, () => {
  console.log('API Server: ' + port + '번 포트에서 대기중')
  console.log('DB Server: ' + dbPort + '번 포트에서 대기중')
})
