'use strict';

var q = require('q');

module.exports = function(bot, options) {

  var slack = bot.slack;
  var logger = bot.logger;

  function getHandler() {
    if (!options.type) {
      return;
    }

    try {
      return require('./listeners/' + options.type);
    } catch (err) {
      logger.debug('Error while getting handler' + options.type, err);
      return;
    }
  }

  return function(message) {
    var defer = q.defer();
    var channel, channelError, channelName, errors, text, textError, ts, type, typeError, user, userName;
    channel = slack.getChannelGroupOrDMByID(message.channel);
    user = slack.getUserByID(message.user);
    type = message.type;
    ts = message.ts;
    text = message.text;
    channelName = channel && channel.is_channel ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
    userName = user && user.name ? '@' + user.name : 'UNKNOWN_USER';

    logger.debug('Received: ' + type + ' ' + channelName + ' ' + userName + ' ' + ts + ' "' + text + '"');

    if (type === 'message' && text && channel) {

      if (options.listen_on.indexOf(channelName) < 0) {
        logger.debug('Skip message, bad channel', channelName);
        return defer.resolve({});
      }

      if (!text.match(options.expression)) {
        logger.debug('Text does not match');
        return defer.resolve({});
      }

      var handler = getHandler();
      if (!handler) {
        logger.debug('Can not find handler');
        return defer.resolve({});
      }

      handler(bot, message, options).then(function(handlerResponse) {
        var response = (options.response || '') + ' ' + handlerResponse;
        if (options.silent) {
          logger.debug('SILENT mode:', response);
          return defer.resolve({});
        }

        var replyChannel = slack.getChannelGroupOrDMByName(options.reply_on);
        if (!replyChannel) {
          logger.debug('Can not find channel', options.reply_on);
          return defer.resolve({});
        }

        replyChannel.send(response);
        return defer.resolve({});
      }, function(err) {
        logger.debug('Error while getting handler response', err);
        return defer.resolve({});
      });

    } else {
      typeError = type !== 'message' ? 'unexpected type ' + type + '.' : null;
      textError = text === null ? 'text was undefined.' : null;
      channelError = channel === null ? 'channel was undefined.' : null;
      errors = [typeError, textError, channelError].filter(function(element) {
        return element !== null;
      }).join(' ');
      logger.debug('@' + slack.self.name + ' could not respond. ' + errors);
      return defer.resolve({});
    }

    return defer.promise;
  };
};
