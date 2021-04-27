# Youtube-Scrapper

Scrapping script that gathers metadata and comments from videos through YouTube API.
Working with [NodeJS](https://nodejs.org/) and [RabbitMQ](https://www.rabbitmq.com/).

# Usage

First, fill the `config.json` file.

Then, launch `app.js` with NodeJS

## Send video id to the app

Use the `readerVideoId` RabbitMQ queue that you've configured and just send a video id as the message.

## Receive video comments

The app sends back 1 to 100 comments to the `writerComments` RabbitMQ queue that you've setuped with this JSON syntax :

```json
{
	"videoId": "",
	"comments" : [
		{
			"author": "",
			"comment": "",
			"publishedAt": ""
		},
		{
			...
		}
	]
}
```

## Receive video metadata

The app sends back the metadata to the `writerMetadata` RabbitMQ queue that you've setuped with this JSON syntax :
```json
{
	"videoId": "",
	"author": "",
	"channelId": "",
	"channelName": "",
	"language": "",
	"duration": "",
	"viewCount": "",
	"likeCount": "",
	"dislikeCount": "",
	"publishedAt": ""
}
```

# Help with config.json

```
youtubeToken: 		The API token to connect to youtube API

host: 				RabbitMQ broker host
user: 				RabbitMQ broker username
password: 			RabbitMQ broker password
		
readerVideoId: 		Queue name where you want to send video ids
writerMetadata: 	Queue name where you want to receive metadata
writerComments: 	Queue name where you want to receive comments
```