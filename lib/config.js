'use strict';

module.exports = {
  token: process.env.SLACK_TOKEN,
  silent: false,
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
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
