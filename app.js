const express = require('express')
const path = require('path')
const logger = require('morgan')
require('dotenv').config()

const port = process.env.PORT
const dbPort = process.env.DB_PORT
const connect = require('./schemas')

const app = express()
connect(dbPort)

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routers separated in routes/ folder
const gameRouter = require('./routes/game')
const playerRouter = require('./routes/player')
const competitionRouter = require('./routes/competition')

app.use('/game', gameRouter)
app.use('/player', playerRouter)
app.use('/competition', competitionRouter)

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    msg: "잘못된 경로의 접속입니다."
  })
});

app.listen(port, () => {
  console.log('API Server: ' + port + '번 포트에서 대기중')
  console.log('DB Server: ' + dbPort + '번 포트에서 대기중')
})
