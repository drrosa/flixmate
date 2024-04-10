const mongoose = require('mongoose');

const { Schema } = mongoose;

const movieSchema = new Schema({
  imdbID: {
    type: String,
    required: true,
    unique: true,
  },
  userRating: {
    type: Number,
    min: 1,
    max: 10,
    default: null,
  },
  recID: {
    type: Schema.Types.ObjectId,
    ref: 'Recommendation',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Movie', movieSchema);
