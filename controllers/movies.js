const Movie = require('../models/movie');
const User = require('../models/user');
const API_KEY = process.env.API_KEY;
const URL = 'https://www.omdbapi.com/?apikey=' + API_KEY + '&t=';
let user = null;

module.exports = {
  index,
  search,
};

function index(req, res) {
  res.render('movies/index', { title: 'My Movies' });
}

async function search(req, res) {
  if (!user)
    user = await User.findById(req.user._id);
  const movies = user.thumbsUp[0].movies;
  const movieSearchTerm = req.query.t;
  const response = await fetch(URL + movieSearchTerm);
  const data = await response.json();
  const movie = await Movie.findOneAndUpdate(
    { imdbID: data.imdbID },
    { $setOnInsert: { imdbID: data.imdbID } },
    { upsert: true, new: true, runValidators: true}
  );
  if (!movies.has(movie.imdbID)) {
    movies.set(data.imdbID, movie._id);
  } else {
    console.log('MOVIE FOUND!');
  }
  res.json(data);
}
