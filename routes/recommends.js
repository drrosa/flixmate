const express = require('express');
const recommendsCtrl = require('../controllers/recommends');
const ensureLoggedIn = require('../config/ensureLoggedIn');

const router = express.Router();

// GET /recommends
router.get('/', ensureLoggedIn, recommendsCtrl.index);
// GET /recommends/:id
router.get('/:id', ensureLoggedIn, recommendsCtrl.show);
// POST /recommends
router.post('/', ensureLoggedIn, recommendsCtrl.create);
// PUT /recommends/:id
router.put('/:id', ensureLoggedIn, recommendsCtrl.toggleLike);
// DELETE /recommends/:id
router.delete('/:id', ensureLoggedIn, recommendsCtrl.delete);

module.exports = router;
