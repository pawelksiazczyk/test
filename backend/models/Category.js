const mongoose = require("mongoose");
const Subcategory = require("./Subcategory").schema;

const CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subcategories: {
    type: [String],
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model("Category", CategorySchema);