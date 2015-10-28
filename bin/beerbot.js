'use strict';

var bot = require('../lib/index');
var token = process.env.SLACK_TOKEN;

var options = {
  token: token,
  silent: false,
  listen_on: ['#jenkins'],
  reply_on: 'general',
  expression: /Failure after/,
  term: 'beer'
};

bot(options).then(function() {
  console.log('Started');
  // TODO disconnect
}, function(err) {
  console.error('Error while starting bot', err);
});
