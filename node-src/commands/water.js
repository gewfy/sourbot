
'use strict'

const config = require('../config');
const Botkit = require('botkit');
const Particle = require('particle-api-js');

const particle = new Particle();

var controller = Botkit.slackbot({});
var bot = controller.spawn();

const ratios = {
    'g': 1176,
    'ml': 1176,
    'dl': 117647
}

const handler = (message, matches) => {
    const amount = matches[1];
    const unit = matches[2];
    const ratio = ratios[unit];
    const duration = Math.ceil(amount * ratio);

    particle.callFunction({ deviceId: config('PARTICLE_DEVICE_ID'), name: 'execute', argument: `water:${duration}`, auth: config('PARTICLE_AUTH_TOKEN') }).then(function(data) {
        bot.replyPublicDelayed(message, `:sweat_drops: Adding ${amount}${unit} of water ~${duration/1000}s`);
    }, function(err) {
        bot.replyPublicDelayed(message, 'Unfortunately I didn\'t manage to do that :disappointed:');
    });
}

module.exports = { pattern: /(\d+)(dl|g) water/i, handler: handler }
