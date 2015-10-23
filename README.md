# beerbot [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
>Slack Beer Bot for Build Failures

A Slack bot which will listen to channels and messages and will automatically reply when messag matches the given pattern.

## Why?

Because the one which breaks the build have to bring beers for ALL the team!

![Build Broken Message](/assets/slack-jenkins.png?raw=true "Build broken")

So this is just to remind him with a beer gif:

![Lets get beers](http://media3.giphy.com/media/ixCowc31ZeKuIHuhFe/200.gif)

## Install

```sh
$ npm install --save beerbot
```

## Usage

```
SLACK_TOKEN=xoxs-YOUR-TOKEN node bin/beerbot.js
```

Check options in ./bin/beerbot.js

## License

MIT © [Christophe Hamerling](http://chamerling.github.io)

[npm-image]: https://badge.fury.io/js/beerbot.svg
[npm-url]: https://npmjs.org/package/beerbot
[travis-image]: https://travis-ci.org/chamerling/beerbot.svg?branch=master
[travis-url]: https://travis-ci.org/chamerling/beerbot
[daviddm-image]: https://david-dm.org/chamerling/beerbot.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/chamerling/beerbot
