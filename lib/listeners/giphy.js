'use strict';

var q = require('q');
var request = require('request');

var DEFAULT_TERM = 'beer';

function getGif(term) {
  var defer = q.defer();

  term = term || DEFAULT_TERM;

  request({
    method: 'GET',
    uri: 'http://api.giphy.com/v1/gifs/translate',
    qs: {
      s: term,
      api_key: 'dc6zaTOxFJmzC'
    },
    json: true
  }, function(err, response, body) {
    if (err) {
      return defer.reject(err);
    }

    if (response.statusCode !== 200) {
      return defer.reject(new Error('Bad response code' + response.statusCode));
    }

    return defer.resolve(body.data.images.fixed_height.url);
  });

  return defer.promise;
}

module.exports = function(message, options) {
  return getGif(options.term);
};
