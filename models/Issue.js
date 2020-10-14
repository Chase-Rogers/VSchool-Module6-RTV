const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IssueSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  imgUrl: {
    type: String,
    required: true
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
})

module.exports = mongoose.model("Issue", IssueSchema)