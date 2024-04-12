const Movie = require('../models/movie');
const User = require('../models/user');

const { API_KEY } = process.env;
const URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
let user = null;
let data = null;
let movieList = null;

async function index(req, res) {
  user = await User.findById(req.user.id);
  const imdbIDs = Array.from(user.thumbsUp[0].movies.keys());
  movieList = await Promise.all(imdbIDs.map(async (imdbID) => {
    const response = await fetch(`${URL}&i=${imdbID}`);
    return response.json();
  }));
  res.render('movies/index', { title: 'My Movies', movieList });
}

function show(req, res) {
  const movie = movieList[req.params.id];
  res.render('movies/show', { title: 'Movie Details', movie });
}

async function search(req, res) {
  const movieSearchTerm = req.query.t;
  const response = await fetch(`${URL}&t=${movieSearchTerm}`);
  data = await response.json();
  res.json(data);
}

async function create(req, res) {
  const { movies } = user.thumbsUp[0];
  const movie = await Movie.findOneAndUpdate(
    { imdbID: data.imdbID },
    { $setOnInsert: { imdbID: data.imdbID, title: data.Title } },
    { upsert: true, new: true, runValidators: true },
  );
  if (!movies.has(movie.imdbID)) {
    movies.set(data.imdbID, movie.id);
    await user.save();
  } else {
    console.log('MOVIE ALREADY EXISTS!');
  }
  res.redirect('/movies');
}

module.exports = {
  index,
  show,
  search,
  create,
};
