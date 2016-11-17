
'use strict'

const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROXY_URI: process.env.PROXY_URI,

  SLACK_COMMAND_TOKEN: process.env.SLACK_COMMAND_TOKEN,
  PARTICLE_DEVICE_ID: process.env.PARTICLE_DEVICE_ID,
  PARTICLE_AUTH_TOKEN: process.env.PARTICLE_AUTH_TOKEN
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}
