
'use strict'

const config = require('../config');
const Botkit = require('botkit');
const Particle = require('particle-api-js');

const particle = new Particle();

var controller = Botkit.slackbot({});
var bot = controller.spawn();

const ratios = {
    's': 1000,
    'sec': 1000,
    'm': 60000,
    'min': 60000
}

const handler = (message, matches) => {
    const amount = matches[1];
    const unit = matches[2];
    const ratio = ratios[unit];
    const duration = Math.ceil(amount * ratio);

    particle.callFunction({ deviceId: config('PARTICLE_DEVICE_ID'), name: 'execute', argument: `mix:${duration}`, auth: config('PARTICLE_AUTH_TOKEN') }).then(function(data) {
        bot.replyPublicDelayed(message, `:cyclone: Mixing for ${amount}${unit}`);
    }, function(err) {
        bot.replyPublicDelayed(message, 'Unfortunately I didn\'t manage to do that :disappointed:');
    });
}

module.exports = { pattern: /(\d+)(sec|min|s|m) mix/i, handler: handler }
