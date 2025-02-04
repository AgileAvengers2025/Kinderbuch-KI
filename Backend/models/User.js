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
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
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
/*     name: {
        type: String,
        default: '',
      },
    address: {
      street: {
        type: String,
      },
      postalCode: {
        type: String,
        match: [/^\d{5}$/, 'Bitte eine gültige Postleitzahl eingeben'],
      },
      city: {
        type: String,
      },
      country: {
        type: String,
        default: 'Deutschland',
      },
    }, */
    kidsNames: {
        type: [String],
        default: [],
      },
  },
  {
    timestamps: true,
  }
);

// Custom id will set to the same as MongoDB's _id
UserSchema.pre('save', function (next) {
  if (!this.id) {
    // If there is no other id set
    this.id = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);