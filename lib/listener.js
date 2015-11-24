'use strict';

function Listener(bot, name, handler, options) {
  this.bot = bot;
  this.name = name;
  this.handler = handler;
  this.options = options;
  this.initialize();
}

Listener.prototype.initialize = function() {
  var self = this;
  var slack = this.bot.slack;
  var logger = this.bot.logger;

  function messageHandler(message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);
    var userName = user && user.name ? '@' + user.name : 'UNKNOWN_USER';
    var type = message.type;
    var ts = message.ts;
    var text = message.text;
    var channelName = channel && channel.is_channel ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');

    logger.debug(self.name + ':: Received: ' + type + ' ' + channelName + ' ' + userName + ' ' + ts + ' "' + text + '"');

    if (self.options.listen_on.indexOf(channelName) < 0) {
      return logger.debug(self.name + ':: Skip message, bad channel', channelName);
    }

    if (!text.match(self.options.expression)) {
      return logger.debug(self.name + ':: Text does not match');
    }

    self.handler(self.bot, message, self.options).then(function(handlerResponse) {
      var response = (self.options.response || '') + ' ' + handlerResponse;
      if (self.options.silent) {
        return logger.debug(self.name + ':: SILENT mode:', response);
      }

      var replyChannel = self.options.reply_on ? slack.getChannelGroupOrDMByName(self.options.reply_on) : channel;
      if (!replyChannel) {
        return logger.debug(self.name + ':: Can not find channel to send response');
      }

      replyChannel.send(response);
    }, function(err) {
      logger.debug(self.name + ':: Error while getting handler response', err);
    });
  }

  self.bot.on('message', messageHandler);
};

module.exports = Listener;
