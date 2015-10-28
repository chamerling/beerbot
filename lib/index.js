'use strict';

var Slack = require('slack-client');
var q = require('q');
var handler = require('./handler');

module.exports = function(options) {
  var defer = q.defer();

  options = options || {};
  if (!options.token) {
    defer.reject(new Error('Slack user token is required'));
  }

  var autoReconnect = options.autoReconnect || true;
  var autoMark = options.autoMark || true;

  var slack = new Slack(options.token, autoReconnect, autoMark);
  slack.on('open', function() {
    console.log('Welcome to BeerBot for Slack. You are @' + slack.self.name + ' of ' + slack.team.name);
    defer.resolve(slack);
  });

  slack.on('message', function(message) {
    options.handlers.forEach(function(opts) {
      handler(slack, opts)(message);
    });
  });

  slack.on('error', function(error) {
    console.log('Slack Error:', + error);
    defer.reject(error);
  });

  slack.login();

  return defer.promise;
};
