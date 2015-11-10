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
      expression: /Failure after/,
      term: 'beer'
    }, {
      name: 'beerbot-giphy',
      listen_on: ['#jenkins'],
      reply_on: '#general',
      response: 'Yeah, build is back!',
      expression: /Back to normal after/,
      term: 'celebrate'
    }
  ]
};

var bot = new BeerBot(options);
bot.on('connected', function() {
  console.log('Bot is started');
});

bot.on('error', function(err) {
  console.error('Error while starting bot', err);
});

bot.start();
