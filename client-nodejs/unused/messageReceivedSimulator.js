const amqp		= require('amqplib/callback_api');
const config	= require('../config.json');

{
	amqp.connect('amqp://' + config.broker.host, (err0, connection) => {
		if (err0) {
			throw err0;
		}

		connection.createChannel(function(err1, channel) {
			if (err1) {
				throw err1;
			}

			var queue = config.queues.readerVideoId;
			var input = "K45YUkPDeSs";

			channel.assertQueue(queue, {
				durable: false
			});

			channel.sendToQueue(queue, Buffer.from(input));
			console.log(" [x] Sent %s", input);
		});
	});
}
