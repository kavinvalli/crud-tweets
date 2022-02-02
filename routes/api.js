const router = require("express").Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const Tweet = require("../models/Tweet");

const schema = Joi.object({
  content: Joi.string().min(10).max(1025).required(),
  author: Joi.string().min(2).max(255).required(),
});

const returnServerError = (err, res) => {
  console.error(err);
  return res.status(500).json({
    message: "Something went wrong!",
  });
};

router.get("/", async (_req, res) => {
  try {
    const tweets = await Tweet.find({});
    return res.json({
      tweets,
    });
  } catch (err) {
    return returnServerError(err, res);
  }
});

router.get("/:tweetId", async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.isValidObjectId(tweetId)) {
    return res.status(400).json({
      message: "Id is not valid",
    });
  }
  // const id = mongoose.Types.ObjectId(tweetId);
  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }
    return res.json({ tweet });
  } catch (err) {
    return returnServerError(err, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const value = await schema.validateAsync(req.body);
    try {
      const newTweet = new Tweet(value);
      await newTweet.save();
      return res.json({
        tweet: newTweet,
      });
    } catch (err) {
      return returnServerError(err, res);
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.put("/:tweetId", async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.isValidObjectId(tweetId)) {
    return res.status(400).json({
      message: "Id is not valid",
    });
  }
  try {
    const value = await schema.validateAsync(req.body);
    try {
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return res.status(404).json({
          message: "Tweet not found",
        });
      }
      tweet.content = value.content;
      tweet.author = value.author;
      await tweet.save();
      return res.json({
        tweet,
      });
    } catch (err) {
      return returnServerError(err, res);
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.delete("/:tweetId", async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.isValidObjectId(tweetId)) {
    return res.status(400).json({
      message: "Id is not valid",
    });
  }
  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({
        message: "Tweet not found",
      });
    }
    await tweet.delete();
    return res.json({
      message: "Successfully deleted",
    });
  } catch (err) {
    return returnServerError(err, res);
  }
});

module.exports = router;
