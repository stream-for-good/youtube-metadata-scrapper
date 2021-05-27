const amqp		= require('amqplib/callback_api');
const config	= require('../config.json');
module.exports = {
	name		: 'sendToRabbitMQ',
	execute(msg, queue) {
		amqp.connect('amqp://' + config.broker.host, (err0, connection) => {
			if (err0) {
				throw err0;
			}

			connection.createChannel(function(err1, channel) {
				if (err1) {
					throw err1;
				}

				channel.assertQueue(queue, {
					durable: false
				});

				channel.sendToQueue(queue, Buffer.from(msg));
			});
		});
	}
}