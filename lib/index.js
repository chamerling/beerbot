'use strict';

var Slack = require('slack-client');
var q = require('q');
var logger = require('winston');

var Listener = require('./listener');
var BeerBot = require('./beerbot');

function getListenerHandler(options) {
  if (!options.name) {
    return;
  }

  try {
    return require('./listeners/' + options.name);
  } catch (err) {
    logger.debug('Error while getting handler' + options.name, err);
    return;
  }
}

module.exports = function(options) {

  var defer = q.defer();

  options = options || {};
  if (!options.token) {
    defer.reject(new Error('Slack user token is required'));
  }

  logger.level = options.logger && options.logger.level ? options.logger.level : 'info';
  var autoReconnect = options.autoReconnect || true;
  var autoMark = options.autoMark || true;

  var slack = new Slack(options.token, autoReconnect, autoMark);
  var bot = new BeerBot({slack: slack, logger: logger});

  options.listeners.forEach(function(l) {
    var handler = getListenerHandler(l);
    if (handler) {
      bot.addListener(new Listener(l.name, handler, l));
    }
  });

  slack.on('open', function() {
    logger.debug('Welcome to BeerBot for Slack. You are @' + slack.self.name + ' of ' + slack.team.name);
    defer.resolve(bot);
  });

  slack.on('error', function(error) {
    logger.debug('Slack Error:', + error);
    defer.reject(error);
  });

  slack.login();
  return defer.promise;
};
