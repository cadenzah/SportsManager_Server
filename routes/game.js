const express = require('express')
const path = require('path')

const Game = require('../schemas/game')

const router = express.Router()

router.get('/list/:id', (req, res, next) => {
  // 해당 id의 "대회" 아래에 열린 경기들 목록 모두 조회
  // json array
  const competId = req.params.id
  Game.find({ competition_id: competId }, (err, games) => {
    if (err) next(err)
    else res.json(games)
  })
})

router.get('/:id', (req, res, next) => {
  // 해당 id의 게임에 대한 정보 조회
  // json object
  const gameId = req.params.id
  Game.find({ _id: gameId }, (err, game) => {
    if (err) next(err)
    else res.json(game)
  })
})

router.put('/:id', (req, res, next) => {
  // 해당 id의 게임에 대하여 정보 수정
  // body로부터 달라진 내용을 전달받음
  // 반환 없음 -> 있어야 하지 않나?

  // body에는 {key: Value} 식으로 데이터가 들어있다.
  // Schema에 따라 payload를 전달한 것이라면 그대로 사용한다

  const gameId = req.params.id
  Game.findByIdAndUpdate(gameId, req.body, null, (err) => {
    if (err) next(err)
    else res.json({
      msg: "요청이 정상적으로 서버로 전송되었습니다만, 제대로 요청 사항이 반영되었는지 반드시 확인하세요!"
    })
  })
})

router.post('/:id', (req, res, next) => {
  // 생성하려는 게임의 대회id
  let competitionId = req.params.id;
  // 해당 id의 "대회"에 대하여 새로운 게임을 생성
  req.body.competition_id = competitionId;
  // 토너먼트 형식에서 위로 올라갈 때마다는 isLeaf를 false로 설정해줘야 함

  Game.find({ competition_id: competitionId }, (err, games) => {
    if(err) next(err);

    let court = 0;
    games.forEach((game) => {
      if(game.court > court) court = game.court;
    });
    court++;
    req.body.court = court;

    const newGame = new Game(req.body);
    newGame.save((err) => {
      if (err) next(err);
      else res.json(newGame)
    })
  });
});

module.exports = router
