'use strict';

const datastore = require('./services/datastore');
const webServer = require('./bin/web-server');
const debug = require('debug')('index');


debug('Starting application.');

(async function () {
	try {
		await datastore.connect();
		await webServer.start();
	} catch (err) {
		debug('Encountered error', err);
		process.exit(1);
	}
})();


process.on('uncaughtException', err => {
	debug('Uncaught exception', err);
	shutdown(err);
});

process.on('SIGTERM', () => {
	debug('Received SIGTERM');
	shutdown();
});

process.on('SIGINT', () => {
	debug('\nReceived SIGINT');
	shutdown();
});


async function shutdown(e) {
	let err = e;
	debug('Shutting down ...');

	try {
		debug('Stopping web server ...');
		await webServer.stop();
	} catch (e) {
		debug('Encountered error', e);
		err = err || e;
	}

	debug('Exiting process');
	if (err) {
		process.exit(1);
	}
	process.exit(0);
}