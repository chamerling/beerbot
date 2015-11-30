'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Slack = require('slack-client');

var Listener = require('./listener');

function BeerBot(options) {
  this.listeners = [];
  this.options = options || {};
  this.initialize();
}
util.inherits(BeerBot, EventEmitter);

BeerBot.prototype.start = function() {
  this.slack.login();
};

BeerBot.prototype.stop = function() {
  return this.slack.disconnect();
};

BeerBot.prototype.getChannelName = function(message) {
  var channel = this.slack.getChannelGroupOrDMByID(message.channel) || this.slack.getChannelGroupOrDMByName(message.channel);
  return channel ? channel.name : null;
};

BeerBot.prototype.send = function(channel, message) {
  var slackChannel = this.slack.getChannelGroupOrDMByID(channel) || this.slack.getChannelGroupOrDMByName(channel);
  if (!slackChannel) {
    return this.logger.error('Can not find channel %s', channel);
  }
  slackChannel.send(message);
};

BeerBot.prototype.isMention = function(message) {
  return !!(message && message.text && message.text.length && message.text.indexOf('<@' + this.user.id) >= 0);
};

BeerBot.prototype.listen = function(pattern, options, callback) {
  this.logger.debug('New Listener added for pattern', pattern);
  this.listeners.push(new Listener(this, pattern, options, callback));
};

BeerBot.prototype.initialize = function() {
  this.q = require('q');
  this.request = require('request');

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

  if (self.options.plugins) {
    self.options.plugins.forEach(function(p) {
      var plugin = getPluginHandler(p);
      if (!plugin) {
        self.logger.error('Can not load plugin', p.name);
      } else {
        plugin(self, p);
      }
    });
  }

  self.slack.on('open', function() {
    self.user = self.slack.self;
    self.logger.debug('Welcome to BeerBot for Slack. You are @' + self.slack.self.name + ' of ' + self.slack.team.name);
    self.emit('connected', {name: self.slack.self.name, team: self.slack.team.name});
  });

  self.slack.on('error', function(error) {
    self.logger.debug('Slack Error:', + error);
    self.emit('error', error);
  });

  self.slack.on('message', function(message) {
    var type = message.type;
    var text = message.text;
    var channel = self.slack.getChannelGroupOrDMByID(message.channel);

    if (type === 'message' && text && channel) {
      self.listeners.forEach(function(listener) {
        listener.receive(message);
      });
    } else {
      self.logger.debug('Can not handle message type %s', message.type);
    }
  });
};

function getPluginHandler(options) {
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
