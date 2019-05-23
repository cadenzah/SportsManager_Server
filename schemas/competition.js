/*
 * DB Record Schema for each competition:
 * _id(uuid(auto-generated))
 * name(string)
 * location(string)
 * date(Date)
 * password(string): SHA256
 */

const mongoose = require('mongoose')

const competitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Competition', competitionSchema)
