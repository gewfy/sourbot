
'use strict'

const config = require('../config');
const Botkit = require('botkit');
const Particle = require('particle-api-js');

const particle = new Particle();

var controller = Botkit.slackbot({});
var bot = controller.spawn();

const handler = (message, matches) => {
    particle.callFunction({ deviceId: config('PARTICLE_DEVICE_ID'), name: 'execute', argument: `stop`, auth: config('PARTICLE_AUTH_TOKEN') }).then(function(data) {
        bot.replyPublicDelayed(message, `:hand: Stopping`);
    }, function(err) {
        bot.replyPublicDelayed(message, 'Unfortunately I didn\'t manage to do that :disappointed:');
    });
}

module.exports = { pattern: /stop/i, handler: handler }
