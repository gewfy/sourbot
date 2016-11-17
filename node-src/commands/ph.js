
'use strict'

const config = require('../config');
const Botkit = require('botkit');
const Particle = require('particle-api-js');

const particle = new Particle();

var controller = Botkit.slackbot({});
var bot = controller.spawn();

const handler = (message) => {
    particle.getVariable({ deviceId: config('PARTICLE_DEVICE_ID'), name: 'pH', auth: config('PARTICLE_AUTH_TOKEN') }).then(function(data) {
        bot.replyPublicDelayed(message, `:lemon: ${data.body.name} ${data.body.result}`);
    }, function(err) {
        bot.replyPublicDelayed(message, 'Unfortunately I didn\'t manage to get that data :disappointed:');
    });
}

module.exports = { pattern: /ph|stats/i, handler: handler }
