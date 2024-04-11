const express = require('express');
const recommendsCtrl = require('../controllers/recommends');
const ensureLoggedIn = require('../config/ensureLoggedIn');

const router = express.Router();

// GET /recommends
router.get('/', ensureLoggedIn, recommendsCtrl.index);
// GET /recommends/:id
router.get('/:id', ensureLoggedIn, recommendsCtrl.show);

module.exports = router;
