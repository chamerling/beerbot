'use strict';

var DEFAULT_TERM = 'beer';

var Slack = require('slack-client');
var giphy = require('./giphy');
var q = require('q');

module.exports = function(options) {
  var defer = q.defer();

  options = options || {};
  if (!options.token) {
    defer.reject(new Error('Slack user token is required'));
  }

  var autoReconnect = options.autoReconnect || true;
  var autoMark = options.autoMark || true;

  var slack = new Slack(options.token, autoReconnect, autoMark);
  slack.on('open', function() {
  	console.log('Welcome to BeerBot for Slack. You are @' + slack.self.name + ' of ' + slack.team.name);
    defer.resolve(slack);
  });

  slack.on('message', function(message) {
  	var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
  	channel = slack.getChannelGroupOrDMByID(message.channel);
  	user = slack.getUserByID(message.user);
  	response = '';
  	type = message.type, ts = message.ts, text = message.text;
  	channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
  	channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
  	userName = (user != null ? user.name : void 0) != null ? '@' + user.name : 'UNKNOWN_USER';

    console.log('Received: ' + type + ' ' + channelName + ' ' + userName + ' ' + ts + ' "' + text + '"');

    if (type === 'message' && (text != null) && (channel != null)) {

      if (options.listen_on.indexOf(channelName) < 0) {
        return console.log('Skip message, bad channel', channelName);
      }

      if (!text.match(options.expression)) {
        return console.log('Text does not match');
      }

      giphy(options.term || DEFAULT_TERM).then(function(gif) {
        var message = (options.message || 'Woooot') + ' ' + gif;
        if (options.silent) {
          return console.log('SILENT mode:', message);
        }

        var replyChannel = slack.getChannelGroupOrDMByName(options.reply_on);
        if (!replyChannel) {
          return console.log('Can not find channel', options.reply_on);
        }

        replyChannel.send(message);
      }, function(err) {
        console.log('Error while getting gif', err);
      });

  	} else {
  		typeError = type !== 'message' ? "unexpected type " + type + "." : null;
  		textError = text == null ? 'text was undefined.' : null;
  		channelError = channel == null ? 'channel was undefined.' : null;
  		errors = [typeError, textError, channelError].filter(function(element) {
  		return element !== null;
  		}).join(' ');
  		return console.log("@" + slack.self.name + " could not respond. " + errors);
  	}
  });

  slack.on('error', function(error) {
    console.error('Slack Error:', + error);
    defer.reject(error);
  });

  slack.login();

  return defer.promise;
}
