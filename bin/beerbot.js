'use strict';

var bot = require('../lib/index');
var token = process.env.SLACK_TOKEN;

var options = {
  token: token,
  silent: false,
  handlers: [
    {
      listen_on: ['#jenkins'],
      reply_on: 'general',
      message: 'Build failure, let\'s have beer!',
      expression: /Failure after/,
      term: 'beer'
    }, {
      listen_on: ['#jenkins'],
      reply_on: 'general',
      message: 'Yeah, build is back!',
      expression: /Back to normal after/,
      term: 'celebrate'
    }
  ]
};

bot(options).then(function() {
  console.log('Started');
  // TODO disconnect
}, function(err) {
  console.error('Error while starting bot', err);
});
