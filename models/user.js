const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thumbsUpSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  movies: {
    type: Map,
    of: Schema.Types.ObjectId
  },
}, {
  timestamps: true
});

const toWatchSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  userPrompt: Map,
  presets: Map,
  recommendations: [{
    type: Schema.Types.ObjectId,
    ref: 'Recommendation'
  }],
}, {
  timestamps: true
});

const userSchema = new Schema({
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  avatar: String,
  openaiKey: String,
  thumbsUp: [thumbsUpSchema],
  toWatch: [toWatchSchema],
  thumbsDown: [{
    type: Schema.Types.ObjectId,
    ref: 'Movie'
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
