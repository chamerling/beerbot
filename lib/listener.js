'use strict';

function Listener(name, handler, options) {
  this.name = name;
  this.handler = handler;
  this.options = options;
}

Listener.prototype.listen = function(bot) {

  var self = this;
  var slack = bot.slack;
  var logger = bot.logger;

  function messageHandler(message) {
    var channel, channelError, channelName, errors, text, textError, ts, type, typeError, user, userName;
    channel = slack.getChannelGroupOrDMByID(message.channel);
    user = slack.getUserByID(message.user);
    type = message.type;
    ts = message.ts;
    text = message.text;
    channelName = channel && channel.is_channel ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
    userName = user && user.name ? '@' + user.name : 'UNKNOWN_USER';

    logger.debug(self.name + ':: Received: ' + type + ' ' + channelName + ' ' + userName + ' ' + ts + ' "' + text + '"');

    if (type === 'message' && text && channel) {

      if (self.options.listen_on.indexOf(channelName) < 0) {
        return logger.debug(self.name + ':: Skip message, bad channel', channelName);
      }

      if (!text.match(self.options.expression)) {
        return logger.debug(self.name + ':: Text does not match');
      }

      self.handler(bot, message, self.options).then(function(handlerResponse) {
        var response = (self.options.response || '') + ' ' + handlerResponse;
        if (self.options.silent) {
          return logger.debug(self.name + ':: SILENT mode:', response);
        }

        var replyChannel = slack.getChannelGroupOrDMByName(self.options.reply_on);
        if (!replyChannel) {
          return logger.debug(self.name + ':: Can not find channel', self.options.reply_on);
        }

        replyChannel.send(response);
      }, function(err) {
        logger.debug(self.name + ':: Error while getting handler response', err);
      });

    } else {
      typeError = type !== 'message' ? 'unexpected type ' + type + '.' : null;
      textError = text === null ? 'text was undefined.' : null;
      channelError = channel === null ? 'channel was undefined.' : null;
      errors = [typeError, textError, channelError].filter(function(element) {
        return element !== null;
      }).join(' ');
      logger.debug(self.name + ':: @' + slack.self.name + ' could not respond. ' + errors);
    }
  }

  slack.on('message', messageHandler);
  return self;
};

module.exports = Listener;
