/*
 * DB Record Schema for each player:
 * _id(uuid(auto-generated))
 * name(string)
 * birth(Date)
 */

const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  birth: {
    type: Date
  }
})

module.exports = mongoose.model('Player', playerSchema)
