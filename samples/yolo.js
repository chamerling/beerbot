'use strict';

var BeerBot = require('../lib');

var options = {
  token: 'xoxp-YOUR-TOKEN', // check https://api.slack.com/web
  silent: false,
  logger: {
    level: 'debug'
  }
};

var yoloOptions = {
  listen_on: ['chamerling-tests'],
  reply_on: 'chamerling-tests',
  response: 'You said: ',
  match: /YOLO/
};

var yalaOptions = {
  listen_on: ['chamerling-tests'],
  reply_on: 'chamerling-tests',
  response: 'You said: ',
  match: function(message) {
    return message.match(/YALA/);
  }
};

var bot = new BeerBot(options);

bot.listen('yolo', function() {
  return {
    receive: function() {
      return bot.q.resolve('YOLO');
    }
  };
}, yoloOptions);

bot.listen('yala', function() {
  return {
    receive: function() {
      return bot.q.resolve('YALA');
    },
    mention: function() {
      return bot.q.resolve('You mentioned me!');
    }
  };
}, yalaOptions);

bot.on('connected', function() {
  console.log('Yolo Bot is started');
});

bot.on('error', function(err) {
  console.error('Error while starting bot', err);
});

bot.start();
