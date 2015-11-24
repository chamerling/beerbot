'use strict';

var BeerBot = require('../lib');

var options = {
  token: 'xoxs-YOUR-TOKEN',
  silent: false,
  logger: {
    level: 'debug'
  }
};

var yoloOptions = {
  listen_on: ['chamerling-tests'],
  reply_on: 'chamerling-tests',
  response: 'You said: ',
  expression: /YOLO/
};

var bot = new BeerBot(options);
bot.listen('yolo', function() {
  return bot.q.resolve('YOLO');
}, yoloOptions);

bot.on('connected', function() {
  console.log('Yolo Bot is started');
});

bot.on('error', function(err) {
  console.error('Error while starting bot', err);
});

bot.start();
