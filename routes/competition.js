const express = require('express')
const path = require('path')

const Competition = require('../schemas/competition')
const router = express.Router()

router.get('/competition/:id', (req, res, err) => {
  // 특정 대회에 대한 정보 열람
  // json object
  const competId = req.params.id
  Competition.find({ _id: competId }, (err, competition) => {
    res.json(competition)
  })
})

router.put('/competition/:id', (req, res, err) => {
  // 특정 대회의 정보 수정
  // 반환값 없음

  // body에는 {key: Value} 식으로 데이터가 들어있다.
  // Schema에 따라 payload를 전달한 것이라면 그대로 사용한다
  const competId = req.params.id
  Competition.findByIdAndUpdate(competId, req.body)
})

router.get('/competition/:page/:count', (req, res, err) => {
  // 전체 대회 목록을 일부만 반환
  // page는 몇번째 페이지
  // count는 페이지 내의 데이터 개수
  const page = req.params.page
  const count = req.params.count
  Competition.find({}, null, { sort: { "date": -1 }, skip: page * count, limit: count}, (err, competitions) => {
    res.json(competitions)
  } )
})

router.get('/competition', (req, res, err) => {
  // 모든 대회 목록 반환
  // json array
  Competition.find({}, (err, competitions) => {
    res.json(competitions)
  })
})

router.post('/competition', (req, res, err) => {
  // 새로운 대회 생성
  // 생성된 새로운 대회의 id 반환
  // json object

  // body에는 {key: Value} 식으로 데이터가 들어있다.
  // Schema에 따라 payload를 전달한 것이라면 그대로 사용한다
  const newCompet = new Competition(req.body)
  newCompet.save((err) => {
    if (err) res.json({ msg: "대회 생성에 실패했습니다." })
    else res.json({ _id: newCompet._id })
  })
})

module.exports = router
