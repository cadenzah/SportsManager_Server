/*
 * DB Record Schema for each game:
 * _id(uuid(auto-generated))
 * competition_id(uuid): reference for the competition
 * court(int): court number this game is held
 * number(int): game order number which can be counted
 * team_A(object):
   { score(int), players(uuid array) }
 * team_B(object):
   { score(int), players(uuid array) }
 * state(string): all lower-case
 */

const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const teamSchema = new Schema({
  score: {
    type: Number,
    default: 0,
  },
  players: {
    type: [String],
  }
})

const gameSchema = new Schema({
  competition_id: {
    type: ObjectId,
    required: true
  },
  device_id: {
    type: String,
    required: true
  },
  court: {
    type: Number,
    // required: true,
    default: 1
  },
  number: {
    type: Number,
    // required: true
    default: 1
  },
  team_A: {
    type: teamSchema,
    default: () => ({})
  },
  team_B: {
    type: teamSchema,
    default: () => ({})
  },
  state: {
    type: Number,
    default: 0
  },
  isLeaf: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('Game', gameSchema)

// 선수 명단 출력이 편하도록, leaf인 것들과 그렇지 않은 것들을 구분해야...
// => leaf인 것들만 찾아서 합쳐버리면 겹치는 것 없이 선수 명단 전부 얻을 수 있다.
