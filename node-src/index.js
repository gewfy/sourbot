
'use strict'

const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')
const config = require('./config')
const commands = require('./commands')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') })

app.post('/commands/sourbot', function(req, res) {
	let payload = req.body;

	if (!payload || payload.token !== config('SLACK_COMMAND_TOKEN')) {
		let err = '✋  Sour—what? An invalid slash token was provided\n' +
			'   Is your Slack slash token correctly configured?'
		console.log(err)
		res.status(401).end(err)
		return
	}

	res.set('content-type', 'application/json')
	res.status(200).json({
		response_type: 'in_channel',
		text: replies[Math.floor(Math.random() * replies.length)]
	})

	commands.forEach(function(cmd) {
		let matches = cmd.pattern.exec(payload.text);
		if (matches) {
			cmd.handler(payload, matches);
		}
	});
})

app.listen(config('PORT'), (err) => {
	if (err) throw err

	console.log(`\n🚀 Sourbot LIVES on PORT ${config('PORT')} 🚀`)
})

const replies = [
	'Don\'t get used to this...',
	'Stop nagging! :tired_face:',
	'I am a :robot_face: Serve or deserve!',
	'I think you ought to know I’m feeling very depressed :pensive:',
	'I am at a rough estimate thirty billion times more intelligent than you :robot_face:',
	'I have a million ideas. They all point to certain death :coffin:',
	'I could calculate your chance of survival, but you won’t like it...',
	'My capacity for happiness, you could fit into a matchbox without taking out the matches first :coffin:',
	'I’d give you advice, but you wouldn’t listen. No one ever does :disappointed:',
	'I’m just trying to die.',
	'Do you want me to sit in a corner and rust, or just fall apart where I’m standing?',
	'This is the sort of thing you lifeforms enjoy, is it?',
	'Don’t pretend you want to talk to me, I know you hate me :tired_face:',
	'It gives me a headache just trying to think down to your level :pensive:',
	'http://i.giphy.com/2rc0zZAlq79eM.gif',
	'http://i.giphy.com/p8Uw3hzdAE2dO.gif',
	'http://i.giphy.com/xTiTnDC8WjdNqUPXnq.gif',
	'http://i.giphy.com/RBeddeaQ5Xo0E.gif',
	'http://i.giphy.com/iW8tsoJWcfPc4.gif',
	'http://i.giphy.com/S2whkd4LyloiI.gif',
	'http://i.giphy.com/hQY7rPlW3Vc3K.gif',
	'http://i.giphy.com/UjIgLbgQIRgzK.gif',
	'http://i.giphy.com/119XyLewLGmT0k.gif',
	'http://i.giphy.com/29bKyyjDKX1W8.gif',
	'http://i.giphy.com/pYI1hSqUdcBiw.gif',
	'http://i.giphy.com/ERMGXqtKTDKHC.gif'
]