'use strict';

var q = require('q');
var request = require('request');

module.exports = function(term) {
  var defer = q.defer();

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
};
