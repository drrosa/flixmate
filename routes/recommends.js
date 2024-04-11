const express = require('express');
const recommendsCtrl = require('../controllers/recommends');
const ensureLoggedIn = require('../config/ensureLoggedIn');

const router = express.Router();

// GET /recommends
router.get('/', ensureLoggedIn, recommendsCtrl.index);

module.exports = router;
