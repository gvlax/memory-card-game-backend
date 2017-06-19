'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const middlewareLogger = require('morgan')('tiny');
const debug = require('debug')('app');
const path = require('path');
const cors = require('cors');
const config = require('config');

const router = require('./services/router');

const app = express();

debug('Initializing an application in a %s environment.', app.get('env'));

app.use(cors());
app.use(middlewareLogger);
app.use(logReqHeaders);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(getApiBasePath(), router);

app.use(handleNotMatchingRoute);
app.use(handleError(app.get('env')));


function getApiBasePath () {
  let apiBasePath = '/api/' + config.api.ver;
  debug('apiBasePath: %s', apiBasePath);
  return apiBasePath;
}


function logReqHeaders(req, res, next) {
  debug('Request headers: %j', req.headers);
  next();
}


function handleNotMatchingRoute(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
}


function handleError(env) {
  return function (err, req, res) {
    debug('Handling an error %O in %s environment.', err, env);
    res.status(err.status || 500).send({
      message: err.message,
      error: env === 'development' ? err : {}
    });
  }
}


module.exports = app;