const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
  },
  writtenAt: Date,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "comment must have a writer"],
  },
  poem: {
    type: mongoose.Schema.ObjectId,
    ref: "Poem",
    required: [true, "comment must belong to a poem"],
  },
  commentLikes: {
    type: Number,
    default: 0,
  },
});

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
