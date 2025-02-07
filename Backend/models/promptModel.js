const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  id: 
  {
    type: String,
    required: true,
    unique: true,
  },
  title: 
  {
    type: String,
    required: true,
    unique: true,
  },
  prompt: 
  {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model("prompt", promptSchema);