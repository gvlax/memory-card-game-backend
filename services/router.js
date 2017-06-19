'use strict';

const express = require('express');
const router = express.Router();
const cards = require('../controllers/cards');
const scores = require('../controllers/scores');


router.route('/cards')
  .get(cards.get);

router.route('/scores')
  .get(scores.get)
  .post(scores.post);


module.exports = router;

