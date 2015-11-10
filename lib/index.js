'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Slack = require('slack-client');
var Listener = require('./listener');

function BeerBot(options) {
  this.listeners = {};
  this.options = options || {};
  this.initialize();
}
util.inherits(BeerBot, EventEmitter);

BeerBot.prototype.addListener = function(listener) {
  var self = this;
  if (!listener) {
    throw new Error('Listener is required');
  }
  self.listeners[listener.name] = listener.listen(self);
};

BeerBot.prototype.start = function() {
  this.slack.login();
};

BeerBot.prototype.createListener = function(name, handler, options) {
  return new Listener(name, handler, options);
};

BeerBot.prototype.initialize = function() {
  var self = this;
  self.options = self.options || {};
  if (!self.options.token) {
    throw new Error('Slack user token is required');
  }
  self.logger = require('winston');
  self.logger.level = self.options.logger && self.options.logger.level ? self.options.logger.level : 'info';
  var autoReconnect = self.options.autoReconnect || true;
  var autoMark = self.options.autoMark || true;

  self.slack = new Slack(self.options.token, autoReconnect, autoMark);

  if (self.options.listeners) {
    self.options.listeners.forEach(function(l) {
      var handler = getListenerHandler(l);
      if (!handler) {
        self.logger.error('Can not load handler', l.name);
      }
      self.addListener(new Listener(l.name, handler, l));
    });
  }

  self.slack.on('open', function() {
    self.logger.debug('Welcome to BeerBot for Slack. You are @' + self.slack.self.name + ' of ' + self.slack.team.name);
    self.emit('connected', {name: self.slack.self.name, team: self.slack.team.name});
  });

  self.slack.on('error', function(error) {
    self.logger.debug('Slack Error:', + error);
    self.emit('error', error);
  });
};

function getListenerHandler(options) {
  if (!options.name) {
    return;
  }

  try {
    return require(options.name);
  } catch (err) {
    return;
  }
}

module.exports = BeerBot;
