'use strict';

const debug = require('debug')('scores');
const scoresApi = require('../dbapi/scores');


async function get(req, res, next) {
	debug('Handling GET request.');
	try {
		let limit = req.query.limit;
		let data = await scoresApi.read( limit ? {limit}: undefined );
		res.status(200).json(data);
	} catch (err) {
		next(err);
	}
}


async function post(req, res, next) {
	debug('Handling POST request.');
	try {
			let data = await scoresApi.create(req.body);
			res.status(200).json(data);
	} catch (err) {
		next(err);
	}
}


module.exports = { get, post };
