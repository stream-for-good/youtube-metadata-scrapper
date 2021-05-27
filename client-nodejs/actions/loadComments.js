module.exports = {
	name		: 'loadComments',
	execute(youtube, videoId, callback) {
		var result = '{"videoId":"' + encodeURI(videoId) + '","comments":[';

		var waiter = new Promise((resolve, reject) => {
			youtube.commentThreads.list({
				'part' : ["snippet"],
				'videoId': videoId,
				'maxResults': 100,
				'order': 'relevance'
			}).then(response => {
				response.data.items.forEach(t => {
					result += "{";
					result += '"author":"';
					result += encodeURI(t.snippet.topLevelComment.snippet.authorDisplayName);
					result += '","comment":"';
					result += encodeURI(t.snippet.topLevelComment.snippet.textDisplay);
					result += '","publishedAt":"';
					result += encodeURI(t.snippet.topLevelComment.snippet.publishedAt);
					result += '"},';
				});
				resolve();
			}, function(err) {
				console.error("Execution error", err); 
			});
		});
		
		waiter.then(() => {
			result = result.slice(0, -1);
			result += "]}";
			console.log(result);
			callback(null, result);
		});
	}
}