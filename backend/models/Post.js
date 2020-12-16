const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  img: [String],
  subcategory: String,
  category: String,
  updatedAt: {
    type: Date,
    required: false
  }
});


module.exports = mongoose.model("Post", PostSchema);