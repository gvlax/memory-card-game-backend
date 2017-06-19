'use strict';

const datastore = require('../services/datastore');


async function create(doc) {
	return datastore.create(doc);
}


async function read(options) {
	return datastore.read(options);
}


module.exports = { create, read };
