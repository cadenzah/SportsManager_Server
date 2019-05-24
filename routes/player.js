const express = require('express')
const path = require('path')

const Player = require('../schemas/player')
const Game = require('../schemas/game')
const router = express.Router()

router.get('/list/:id', (req, res, next) => {
  // 해당 id의 대회에 출전중인 선수 명단 반환
  // json array
  const competId = req.params.id
  Game.find({ competition_id: competId, isLeaf: true }, { team_A: 1, team_B: 1 }, {}, (err, games) => {
    console.log(games)
    // games는 {team_A와 team_B}로 구성된 객체
    let playerIds = []

    games.map((eachGame) => {
      const teamAPlayers = eachGame.team_A.players
      const teamBPlayers = eachGame.team_B.players
      const playersForThisGame = teamAPlayers.concat(teamBPlayers)

      playersForThisGame.map((player) => {
        playerIds.push(player)
      })
    })

    // players 내에 든 각각의 id를 사용하여 검색
    // 1. 프라미스?
    // 2. 여러 id에 대하여 검색?
    // => 반환
    Player.find({ _id: { $in: playerIds } }, (err, players) => {
      if (err) next(err)
      else res.json(players)
    })
  })
})

router.get('/:id', (req, res, next) => {
  // 해당 id의 선수에 대한 정보 반환
  // json object
  const playerId = req.params.id
  Player.find({ _id: playerId }, (err, player) => {
    if (err) next(err)
    else res.json(player)
  })
})

router.get('/', (req, res, next) => {
  // 등록된 모든 선수 반환
  // json object array
  Player.find({}, (err, players) => {
    if (err) next(err)
    else res.json(players)
  })
})

router.post('/', (req, res, next) => {
  // 해당 id의 선수에 대한 정보 반환
  // json object

  // body에는 {key: Value} 식으로 데이터가 들어있다.
  // Schema에 따라 payload를 전달한 것이라면 그대로 사용한다 (검사 안함)
  const newPlayer = new Player(req.body)
  newPlayer.save((err) => {
    if (err) next(err)
    else res.json(newPlayer)
  })
})


module.exports = router
