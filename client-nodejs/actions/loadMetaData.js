module.exports = {
	name		: 'loadMetadata',
	execute(youtube, videoId, callback) {
		var result = '{"videoId":"' + encodeURI(videoId) + '",';;

		var waiter = new Promise((resolve, reject) => {
			youtube.videos.list({
				'part' : ['id', 'snippet', 'statistics', 'contentDetails'],
				'id': videoId
			}).then(response => {
				response.data.items.forEach((t, index, array) => {
					result += '"author":"';
					result += encodeURI(t.snippet.title);
					result += '","channelId":"';
					result += encodeURI(t.snippet.channelId);
					result += '","channelName":"';
					result += encodeURI(t.snippet.channelTitle);
					result += '","language":"';
					result += encodeURI(t.snippet.language);
					result += '","duration":"';
					result += encodeURI(t.contentDetails.duration);
					result += '","viewCount":"';
					result += encodeURI(t.statistics.viewCount);
					result += '","likeCount":"';
					result += encodeURI(t.statistics.likeCount);
					result += '","dislikeCount":"';
					result += encodeURI(t.statistics.dislikeCount);
					result += '","publishedAt":"';
					result += encodeURI(t.snippet.publishedAt);
					result += '"},';
					resolve()
				})
			}, function(err) {
				console.error("Execution error", err); 
			});
		});
		
		waiter.then(() => {
			result = result.slice(0, -1);
			console.log(result);
			callback(null, result);
		});
	}
}