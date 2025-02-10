const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    content: [
      {
        id: {
          type: Number,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          default: '',
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Story', StorySchema);