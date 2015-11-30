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
  response: 'You said: '
};

var bot = new BeerBot(options);

bot.listen(/YOLO/, yoloOptions, function() {
  return bot.q.resolve('YOLO');
});

bot.on('connected', function() {
  console.log('Yolo Bot is started');
});

bot.on('error', function(err) {
  console.error('Error while starting bot', err);
});

bot.start();
