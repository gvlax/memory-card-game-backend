'use strict';

const debug = require('debug')('cards');
const request = require('request');

const config = require('config');


async function get(req, res, next) {
	req.pipe(request({qs: req.query, url: config.cardsApi.forwardUrl})).pipe(res);
}


module.exports = { get };
