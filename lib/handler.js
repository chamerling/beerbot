'use strict';

var DEFAULT_TERM = 'beer';
var giphy = require('./giphy');

module.exports = function(slack, options) {

  return function(message) {
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
        return console.log('Skip message, bad channel', channelName);
      }

      if (!text.match(options.expression)) {
        return console.log('Text does not match');
      }

      giphy(options.term || DEFAULT_TERM).then(function(gif) {
        var response = (options.message || 'Woooot') + ' ' + gif;
        if (options.silent) {
          return console.log('SILENT mode:', response);
        }

        var replyChannel = slack.getChannelGroupOrDMByName(options.reply_on);
        if (!replyChannel) {
          return console.log('Can not find channel', options.reply_on);
        }

        replyChannel.send(response);
      }, function(err) {
        console.log('Error while getting gif', err);
      });

    } else {
      typeError = type !== 'message' ? 'unexpected type ' + type + '.' : null;
      textError = text === null ? 'text was undefined.' : null;
      channelError = channel === null ? 'channel was undefined.' : null;
      errors = [typeError, textError, channelError].filter(function(element) {
        return element !== null;
      }).join(' ');
      return console.log('@' + slack.self.name + ' could not respond. ' + errors);
    }
  };
};
