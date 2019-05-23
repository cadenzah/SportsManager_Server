const express = require('express')
const path = require('path')

const Player = require('../schemas/player')
const Game = require('../schemas/game')
const router = express.Router()

router.get('/player/list/:id', (req, res, err) => {
  // 해당 id의 대회에 출전중인 선수 명단 반환
  // json array

  // game 중에서
  //   _id: competId
  //   isLeaf: true
  // 인 것들
  //               -> 각각으로부터 team_A, team_B를 추출하고, players 배열을 하나로 모은다
  // 모인 players 배열 내의 _id들을 프라미스로 검색 돌리기

  const competId = req.params.id
  // Game.find({ _id: competId }, {}, (err, ))
  // Player.find({}, (err, players) => {
  //   res.json(players)
  // }) // 미완성
})

router.get('/player/:id', (req, res, err) => {
  // 해당 id의 선수에 대한 정보 반환
  // json object
  const playerId = req.params.id
  Player.find({ _id: playerId }, (err, player) => {
    res.json(player)
  })
})

module.exports = router
