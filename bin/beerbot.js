#! /usr/bin/env node

'use strict';

var BeerBot = require('../lib/beerbot');
var token = process.env.SLACK_TOKEN;

var options = {
  token: token,
  silent: false,
  logger: {
    level: 'debug'
  },
  plugins: [
    {
      name: 'beerbot-hublin',
      response: 'Your Hubl.in conference is ready at '
    },
    {
      name: 'beerbot-giphy',
      listen_on: ['#jenkins'],
      reply_on: '#general',
      response: 'Build failure, let\'s have beer!',
      match: /Failure after/,
      term: 'beer'
    },
    {
      name: 'beerbot-giphy',
      listen_on: ['#jenkins'],
      reply_on: '#general',
      response: 'Yeah, build is back!',
      match: /Back to normal after/,
      term: 'celebrate'
    },
    {
      name: 'beerbot-giphy',
      response: ':beer: Beer? Beer! :beer:',
      match: /beer/,
      term: 'beer'
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
