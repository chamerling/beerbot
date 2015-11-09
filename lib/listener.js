'use strict';

var q = require('q');

module.exports = function(slack, options) {

  function getHandler() {
    if (!options.type) {
      return;
    }

    try {
      return require('./listeners/' + options.type);
    } catch (err) {
      console.log('Error while getting handler' + options.type, err);
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

    console.log('Received: ' + type + ' ' + channelName + ' ' + userName + ' ' + ts + ' "' + text + '"');

    if (type === 'message' && text && channel) {

      if (options.listen_on.indexOf(channelName) < 0) {
        console.log('Skip message, bad channel', channelName);
        return defer.resolve({});
      }

      if (!text.match(options.expression)) {
        console.log('Text does not match');
        return defer.resolve({});
      }

      var handler = getHandler();
      if (!handler) {
        console.log('Can not find handler');
        return defer.resolve({});
      }

      handler(message, options).then(function(handlerResponse) {
        var response = (options.response || '') + ' ' + handlerResponse;
        if (options.silent) {
          console.log('SILENT mode:', response);
          return defer.resolve({});
        }

        var replyChannel = slack.getChannelGroupOrDMByName(options.reply_on);
        if (!replyChannel) {
          console.log('Can not find channel', options.reply_on);
          return defer.resolve({});
        }

        replyChannel.send(response);
        return defer.resolve({});
      }, function(err) {
        console.log('Error while getting handler response', err);
        return defer.resolve({});
      });

    } else {
      typeError = type !== 'message' ? 'unexpected type ' + type + '.' : null;
      textError = text === null ? 'text was undefined.' : null;
      channelError = channel === null ? 'channel was undefined.' : null;
      errors = [typeError, textError, channelError].filter(function(element) {
        return element !== null;
      }).join(' ');
      console.log('@' + slack.self.name + ' could not respond. ' + errors);
      return defer.resolve({});
    }

    return defer.promise;
  };
};
