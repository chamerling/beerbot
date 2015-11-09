'use strict';

function BeerBot(options) {
  this.listeners = {};
  this.options = options || {};
  this.slack = options.slack;
  this.logger = options.logger || require('winston');
}

BeerBot.prototype.addListener = function(listener) {
  var self = this;
  if (!listener) {
    throw new Error('Listener is required');
  }
  self.listeners[listener.name] = listener.listen(self);
};

module.exports = BeerBot;
