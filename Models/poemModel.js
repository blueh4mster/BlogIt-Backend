const mongoose = require("mongoose");
const slug = require("slugify");

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "a poem must have a title"],
  },
  slug: String,
  description: String,
  content: String,
  publishedOn: Date,
  edited: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Poem = new mongoose.model("Poem", poemSchema);

poemSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = Poem;
