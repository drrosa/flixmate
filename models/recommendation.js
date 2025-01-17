const mongoose = require('mongoose');

const { Schema } = mongoose;

const recommendationSchema = new Schema({
  imdbID: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  reasoning: {
    type: String,
    default: null,
  },
  liked: {
    type: Boolean,
    default: null,
  },
  hide: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
