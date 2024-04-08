const Movie = require('../models/movie');
const API_KEY = process.env.API_KEY;
const URL = 'https://www.omdbapi.com/?apikey=' + API_KEY + '&t=';

module.exports = {
  index,
  search,
};

function index(req, res) {
  res.render('movies/index', { title: 'My Movies' });
}

async function search(req, res) {
  const movieSearchTerm = req.query.t;
  const response = await fetch(URL + movieSearchTerm);
  const data = await response.json();
  res.json(data);
}
