const Movie = require('../models/movie');
const User = require('../models/user');
const API_KEY = process.env.API_KEY;
const URL = 'https://www.omdbapi.com/?apikey=' + API_KEY;
let user = null;
let data = null;

module.exports = {
  index,
  search,
  create,
};

async function index(req, res) {
  if (!user) user = await User.findById(req.user._id);
  const imdbIDs = Array.from(user.thumbsUp[0].movies.keys());
  const movies = await Promise.all(imdbIDs.map(async imdbID => {
    const response = await fetch(URL + '&i=' + imdbID);
    return await response.json();
  }));
  res.render('movies/index', { title: 'My Movies', movies });
}

async function search(req, res) {
  const movieSearchTerm = req.query.t;
  const response = await fetch(URL + '&t=' + movieSearchTerm);
  data = await response.json();
  res.json(data);
}

async function create(req, res) {
  const movies = user.thumbsUp[0].movies;
  const movie = await Movie.findOneAndUpdate(
    { imdbID: data.imdbID },
    { $setOnInsert: { imdbID: data.imdbID } },
    { upsert: true, new: true, runValidators: true}
  );
  if (!movies.has(movie.imdbID)) {
    movies.set(data.imdbID, movie._id);
    await user.save();
  } else {
    console.log('MOVIE ALREADY EXISTS!');
  }
  res.redirect('/movies');
}
