const Movie = require('../models/movie');
const User = require('../models/user');
const API_KEY = process.env.API_KEY;
const URL = 'https://www.omdbapi.com/?apikey=' + API_KEY;
let user = null;

module.exports = {
  index,
  search,
};

async function index(req, res) {
  let movies = []
  if (user) {
    const imdbIDs = Array.from(user.thumbsUp[0].movies.keys());
    console.log(imdbIDs);
    movies = await Promise.all(imdbIDs.map(async imdbID => {
      const response = await fetch(URL + '&i=' + imdbID);
      return await response.json();
    }));
    console.log(movies);
  }
    res.render('movies/index', { title: 'My Movies', movies });
}

async function search(req, res) {
  if (!user)
    user = await User.findById(req.user._id);
  const movies = user.thumbsUp[0].movies;
  const movieSearchTerm = req.query.t;
  const response = await fetch(URL + '&t=' + movieSearchTerm);
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
