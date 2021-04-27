const config	= require('./config.json');
const fs 		= require('fs');
const {google}	= require('googleapis');
const amqp		= require('amqplib/callback_api');
const youtube	= google.youtube({
	version	: 'v3',
	auth	: config.youtubeToken
});
const actions = new Map();

const files = fs.readdirSync('./actions').filter(file => file.endsWith('.js'));
for (const file of files) {
	const action = require(`./actions/${file}`);
	actions.set(action.name, action);
}

amqp.connect('amqp://' + config.broker.user + ':' + config.broker.password + '@' + config.broker.host, function(err0, connection) {
	if (err0) {
		throw err0;
	}
	connection.createChannel(function(err1, channel) {
		if (err1) {
			throw err1;
		}
		var queue = config.queues.readerVideoId;

		channel.assertQueue(queue, {
			durable: false
		});

		channel.consume(queue, (msg) => {
			actions.get("loadMetadata").execute(youtube, msg.content.toString(), (err, data) => {
				actions.get('sendToRabbitMQ').execute(data, config.queues.writerMetadata);
			});
			actions.get("loadComments").execute(youtube, msg.content.toString(), (err, data) => {
				actions.get('sendToRabbitMQ').execute(data, config.queues.writerComments);
			});
		}, {
			noAck: true
		});
	});
});