'use strict';

const db = require('nedb');
const debug = require('debug')('datastore');

const config = require('config');


function DataStore() {

	this.datastore = null;


	this.connect = async () => {
		debug(`Connecting to a datastore: ${config.datastore.scores}`);
		this.datastore = new db({
			filename: config.datastore.scores,
			timestampData: true
		});
		return new Promise((resolve, reject) => {
			this.datastore.loadDatabase(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	};


	this.create = async (doc) => {
		debug('Create entry in a datastore.');
		return new Promise((resolve, reject) => {
			this.datastore.insert(doc, (err, newDoc) => {
				if (err) {
					return reject(err);
				}
				resolve(newDoc);
			});
		});
	};


	this.read = async (options = {limit: 5}) => {
		return new Promise((resolve, reject) => {
			this.datastore.find({})
				.limit(options.limit)
				.sort({ score: 1, createdAt: 1 })
				.exec(function (err, docs) {
				if (err) {
					return reject(err);
				}
				resolve(docs);
			});
		});
	}
}


module.exports = new DataStore();