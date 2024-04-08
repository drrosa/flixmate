const Movie = require('../models/movie');


module.exports = {
  index,
};

function index(req, res) {
  res.render('movies/index', { title: 'My Movies' });
}
