const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    prompt: {
      type: String,
      required: true,
      unique: true,
    },
    scene: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prompt", promptSchema);