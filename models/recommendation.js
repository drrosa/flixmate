const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recommendationSchema = new Schema({
  imdbID: {
    type: String,
    required: true,
    unique: true
  },
  reasoning: {
    type: String,
    required: true,
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
    timestamps: true
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
