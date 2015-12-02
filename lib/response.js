'use strict';

function Response(bot, message, match, options) {
  this.bot = bot;
  this.message = message;
  this.options = options;
  this.match = match;
}

Response.prototype.generateResponseText = function(response) {
  return this.options.response ? this.options.response + ' ' + response : response;
};

Response.prototype.getSourceChannelName = function() {
  return this.bot.getChannelName(this.message);
};

Response.prototype.getResponseChannelName = function() {
  return this.options.reply_on || this.message.channel;
};

Response.prototype.sendRichText = function(text) {
  this.bot.sendRichText(this.getResponseChannelName(), this.generateResponseText(text));
};

Response.prototype.send = function(text) {
  this.bot.send(this.getResponseChannelName(), this.generateResponseText(text));
};

module.exports = Response;
