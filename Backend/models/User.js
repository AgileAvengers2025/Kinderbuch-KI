const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Bitte eine gültige E-Mail Adresse eingeben.'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    kidsNames: {
      type: [String],
      default: [],
    },
    createdStories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Custom id will set to the same as MongoDB's _id
UserSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);