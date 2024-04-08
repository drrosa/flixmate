const express = require('express');
const router = express.Router();
const moviesCtrl = require('../controllers/movies');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// GET /movies
router.get('/', ensureLoggedIn, moviesCtrl.index);

module.exports = router;
