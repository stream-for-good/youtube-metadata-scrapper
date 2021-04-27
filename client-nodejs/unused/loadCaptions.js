module.exports = {
	name		: 'loadCaptions',
	execute(youtube, videoIds, callback) {
		var result = [];

		var waiter = new Promise((resolve, reject) => {
			videoIds.forEach((videoId, index, array) => {
				youtube.captions.list({
					'part' : ["snippet"],
					'videoId': videoId
				}).then(response => {
					response.data.items.forEach(t => {
						youtube.captions.download({
							'id': t.id
						}).catch(e => {
							console.log(e);
						});
						/*result.push({
							"captions" : t
						});*/
					});
				}, function(err) {
					console.error("Execution error", err); 
				}).then(() => {
					if (index === array.length - 1) resolve()
				});
			});
		});
		
		waiter.then(() => {
			callback(null, result);
		});
	}
}