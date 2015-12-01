'use strict';

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
  var self = this;

  var channel = slack.getChannelGroupOrDMByID(message.channel);
  var user = slack.getUserByID(message.user);
  var userName = user && user.name ? '@' + user.name : 'UNKNOWN_USER';
  var type = message.type;
  var ts = message.ts;
  var text = message.text;
  var channelName = channel && channel.is_channel ? '#' : '';
  channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');

  logger.debug(self.name + ':: Received: ' + type + ' on ' + channelName + ' from ' + userName + ' at ' + ts + ': "' + text + '"');

  if (self.options.listen_on && self.options.listen_on.length && self.options.listen_on.indexOf(channelName) < 0) {
    return logger.debug(self.name + ':: Skip message, bad channel', channelName);
  }

  if (typeof self.pattern === 'function') {
    message.match = self.pattern.match(text, self.bot);
  } else {
    message.match = text.match(self.pattern);
  }

  if (!message.match) {
    return logger.debug(self.name + ':: Text does not match');
  }

  self.handler(message).then(function(handlerResponse) {
    if (!handlerResponse || handlerResponse.length === 0) {
      return logger.debug('Empty response');
    }

    var response = (self.options.response || '') + ' ' + handlerResponse;
    if (self.options.silent) {
      return logger.debug(self.name + ':: SILENT mode:', response);
    }

    self.bot.send(self.options.reply_on || message.channel, response);

  }, function(err) {
    logger.debug(self.name + ':: Error while getting handler response', err);
  });
};

module.exports = Listener;
