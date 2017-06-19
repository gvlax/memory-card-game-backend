'use strict';

const http = require('http');
const config = require('config');
const debug = require('debug')('web-server');

const app = require('../app');


let httpServer;


async function start() {
  debug('Starting web server');

  return new Promise((resolve, reject) => {

    httpServer = http.Server(app);

    httpServer.on('connection', trackConnection);
    httpServer.on('error', onError);
    httpServer.on('listening', onListening);

    httpServer.listen(config.server.port, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}


async function stop() {
  return new Promise((resolve, reject) => {
    for (let key in openHttpConnections) {
      openHttpConnections[key].destroy();
    }
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}


const openHttpConnections = {};


function trackConnection(conn) {
  const key = conn.remoteAddress + ':' + (conn.remotePort || '');
  debug(`tracking connection: ${key}`);
  openHttpConnections[key] = conn;

  conn.on('close', () => {
    debug(`Handling 'close' event for ${key} connection ...`);
    delete openHttpConnections[key];
  });
}


function onError(error) {
  debug(`Handling 'error' event ${error}`);

  if (error.syscall !== 'listen') {
    throw error;
  }
  const port = config.server.port;
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      debug(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug(`Web server listening on ${bind}`);
}


module.exports = {start, stop};


