const express = require('express')
const path = require('path')
const moment = require('moment')

const Competition = require('../schemas/competition')
const router = express.Router()

router.post('/admin', (req, res, next) => {
  // admin mode
  // password check
  const { competId, password } = req.body
  Competition.find({ _id: competId }, (err, competitions) => {
    if (err) next(err)
    else {
      const competition = competitions[0]
      if (competition.password === password) {
        res.json({
          msg: true
        })
      } else {
        res.json({
          msg: false
        })
      }
    }
  })
})

router.get('/:id', (req, res, next) => {
  // 특정 대회에 대한 정보 열람
  // json object
  const competId = req.params.id
  Competition.find({ _id: competId }, (err, competition) => {
    if (err) next(err)
    else res.json(competition)
  })
})

router.put('/:id', (req, res, next) => {
  // 특정 대회의 정보 수정
  // 반환값 없음

  // body에는 {key: Value} 식으로 데이터가 들어있다.
  // Schema에 따라 payload를 전달한 것이라면 그대로 사용한다

  const competId = req.params.id
  Competition.findByIdAndUpdate(competId, req.body, null, (err) => {
    if (err) next(err)
    else res.json({
      msg: "요청이 정상적으로 서버로 전송되었습니다만, 제대로 요청 사항이 반영되었는지 반드시 확인하세요!"
    })
  })
})

router.get('/:page/:count', (req, res, next) => {
  // 전체 대회 목록을 일부만 반환
  // page는 몇번째 페이지
  // count는 페이지 내의 데이터 개수
  const page = req.params.page
  const count = req.params.count
  Competition.find({}, null, { sort: { "date": -1 }, skip: page * count, limit: count}, (err, competitions) => {
    if (err) next(err)
    else res.json(competitions)
  } )
})

router.get('/', (req, res, next) => {
  // 모든 대회 목록 반환
  // json array
  Competition.find({}, (err, competitions) => {
    if (err) next(err)
    else res.json(competitions)
  })
})

router.post('/', (req, res, next) => {
  // 새로운 대회 생성
  // 생성된 새로운 대회의 id 반환
  // json object

  // body에는 {key: Value} 식으로 데이터가 들어있다.
  // Schema에 따라 payload를 전달한 것이라면 그대로 사용한다

  // password에 대하여 암호화 필요
  // 암호화한 뒤 해당 필드만 변경한 새로운 객체를 전달

  // save date only, not time
  req.body.date = moment().format('YYYY-MM-DD')
  const newCompet = new Competition(req.body)
  newCompet.save((err) => {
    if (err) next(err)
    else res.json({ _id: newCompet._id })
  })
})

module.exports = router
