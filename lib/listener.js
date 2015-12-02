'use strict';

var Response = require('./response');

function Listener(bot, pattern, options, handler) {
  this.bot = bot;
  this.pattern = pattern;
  this.options = options;
  this.handler = handler;
  this.name = options.name || '';
}

Listener.prototype.receive = function(message) {
  var slack = this.bot.slack;
  var logger = this.bot.logger;

  var channel = slack.getChannelGroupOrDMByID(message.channel);
  var user = slack.getUserByID(message.user);
  var userName = user && user.name ? '@' + user.name : 'UNKNOWN_USER';
  var type = message.type;
  var ts = message.ts;
  var text = message.text;
  var channelName = channel && channel.is_channel ? '#' : '';
  channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');

  logger.debug(this.name + ':: Received: ' + type + ' on ' + channelName + ' from ' + userName + ' at ' + ts + ': "' + text + '"');

  if (this.options.listen_on && this.options.listen_on.length && this.options.listen_on.indexOf(channelName) < 0) {
    return logger.debug(this.name + ':: Skip message, bad channel', channelName);
  }

  var match;
  if (typeof this.pattern === 'function') {
    match = this.pattern.match(text, this.bot);
  } else {
    match = text.match(this.pattern);
  }

  if (!match) {
    return logger.debug(this.name + ':: Text does not match');
  }

  this.handler(new Response(this.bot, message, match, this.options));
};

module.exports = Listener;
