'use strict';

var BeerBot = require('../lib/index');
var token = process.env.SLACK_TOKEN;

var options = {
  token: token,
  silent: false,
  logger: {
    level: 'debug'
  },
  listeners: [
    {
      name: 'beerbot-giphy',
      listen_on: ['#jenkins'],
      reply_on: '#general',
      response: 'Build failure, let\'s have beer!',
      match: /Failure after/,
      term: 'beer'
    }, {
      name: 'beerbot-giphy',
      listen_on: ['#jenkins'],
      reply_on: '#general',
      response: 'Yeah, build is back!',
      match: /Back to normal after/,
      term: 'celebrate'
    }
  ]
};

var bot = new BeerBot(options);
bot.on('connected', function() {
  bot.logger.info('Beerbot is started');
});

bot.on('error', function(err) {
  bot.logger.error('Error while starting beerbot', err);
});

bot.start();
