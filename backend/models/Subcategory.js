const mongoose = require("mongoose");
const { schema } = require("./Post");
const Post = require("./Post").schema;

const SubcategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  img: String,
  posts: {
    type: [String],
    required: false
  },
  category: String,
  date: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: false
  }
});


module.exports = mongoose.model("Subcategory", SubcategorySchema);