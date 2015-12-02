'use strict';

var chai = require('chai');
var expect = chai.expect;
var mockery = require('mockery');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

describe('beerbot', function() {

  beforeEach(function() {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
  });

  afterEach(function() {
    mockery.resetCache();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('The isMention function', function() {

    var user = {
      id: 'U123456',
      name: 'beerbot'
    };

    var loggerMock = {
      debug: console.log,
      info: console.log
    };

    beforeEach(function() {
      function SlackMock() {
        this.self = user;
        this.logger = loggerMock;
        this.team = {name: 'team'};
      }
      util.inherits(SlackMock, EventEmitter);

      mockery.registerMock('slack-client', SlackMock);
      mockery.registerMock('winston', loggerMock);
    });

    it('should return false when message is undefined', function() {
      var Beerbot = require('../lib/beerbot');
      var bot = new Beerbot({token: '123'});
      expect(bot.isMention()).to.be.false;
    });

    it('should return false when message.text is undefined', function() {
      var Beerbot = require('../lib/beerbot');
      var bot = new Beerbot({token: '123'});
      expect(bot.isMention({})).to.be.false;
    });

    it('should return false when message.text is empty', function() {
      var Beerbot = require('../lib/beerbot');
      var bot = new Beerbot({token: '123'});
      expect(bot.isMention({text: ''})).to.be.false;
    });

    it('should return true when message.text contains a bot id', function() {
      var Beerbot = require('../lib/beerbot');
      var bot = new Beerbot({token: '123'});
      bot.slack.emit('open');
      expect(bot.isMention({text: 'This is a text with a mention <@' + user.id + '>'})).to.be.true;
    });

    it('should return true when message.text starts with the bot user id', function() {
      var Beerbot = require('../lib/beerbot');
      var bot = new Beerbot({token: '123'});
      bot.slack.emit('open');
      expect(bot.isMention({text: '<@' + user.id + '> hey!!!'})).to.be.true;
    });

    it('should return false when message.text does not contains the bot user id', function() {
      var Beerbot = require('../lib/beerbot');
      var bot = new Beerbot({token: '123'});
      bot.slack.emit('open');
      expect(bot.isMention({text: '<@000> hey!!!'})).to.be.false;
    });

    it('should return false when message.text does not contains any user', function() {
      var Beerbot = require('../lib/beerbot');
      var bot = new Beerbot({token: '123'});
      bot.slack.emit('open');
      expect(bot.isMention({text: 'hey!!!'})).to.be.false;
    });
  });
});
