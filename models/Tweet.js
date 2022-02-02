const mongoose = require("mongoose");

const TweetSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    min: 10,
    max: 1025,
  },
  author: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tweet = mongoose.model("Tweet", TweetSchema);
module.exports = Tweet;
