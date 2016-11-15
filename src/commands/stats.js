
'use strict'

const config = require('../config');
const Botkit = require('botkit');
const Particle = require('particle-api-js');

const particle = new Particle();

var controller = Botkit.slackbot({});
var bot = controller.spawn();

const handler = (message) => {
    setTimeout(() => {
        bot.replyPublicDelayed(message, `<https://io.adafruit.com/gewfy/sourdough-bot|See detailed chart data>`)
    }, 0);
}

module.exports = { pattern: /ph|co2|stats/i, handler: handler }
