const express = require('express');
const moviesCtrl = require('../controllers/movies');
const ensureLoggedIn = require('../config/ensureLoggedIn');

const router = express.Router();

// GET /movies
router.get('/', ensureLoggedIn, moviesCtrl.index);
// GET /movies/search
router.get('/search', moviesCtrl.search);
// POST /movies
router.post('/', ensureLoggedIn, moviesCtrl.create);

module.exports = router;
