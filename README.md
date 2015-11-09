# beerbot [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
>Slack Beer Bot for Build Failures

A Slack bot which will listen to channels and will automatically reply with a custom message and a gif generated from [giphy](http://giphy.com) when message matches the given pattern.

## Why?

Because the one which breaks the build have to bring beers for ALL the team!

![Build Broken Message](/assets/slack-jenkins.png?raw=true "Build broken")

So this is just to remind him with a message and a random beer gif:

![Lets get beers](http://media3.giphy.com/media/ixCowc31ZeKuIHuhFe/200.gif)

## Install

```sh
$ npm install --save beerbot
```

## Usage

```js
var BeerBot = require('beerbot');
var token = 'xoxs-YOUR-TOKEN'; // check the slack API doc

// let's have beers when the build is broken, and let's celebrate when it is back!
var options = {
  token: token,
  silent: false,
  logger: {
    level: 'info'
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
```

You can directly adapt and use ./bin/beerbot.js:

```sh
$ SLACK_TOKEN=xoxs-YOUR-TOKEN node bin/beerbot.js
```

## License

MIT © [Christophe Hamerling](http://chamerling.github.io)

[npm-image]: https://badge.fury.io/js/beerbot.svg
[npm-url]: https://npmjs.org/package/beerbot
[travis-image]: https://travis-ci.org/chamerling/beerbot.svg?branch=master
[travis-url]: https://travis-ci.org/chamerling/beerbot
[daviddm-image]: https://david-dm.org/chamerling/beerbot.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/chamerling/beerbot
