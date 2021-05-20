import celery

from celery import Celery
import os

import google_auth_oauthlib
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import docker

scopes = ["https://www.googleapis.com/auth/youtube.readonly"]

api_key = os.getenv("API_KEY")
broker_user = os.getenv("BROKER_USER")
broker_password = os.getenv("BROKER_PASSWORD")
broker_host = os.getenv("BROKER_HOST")
api_service_name = "youtube"
api_version = "v3"
youtube = googleapiclient.discovery.build(api_service_name, api_version, developerKey=api_key)

app = Celery('hello',
             backend='rpc://',
             broker=f'amqp://{broker_user}:{broker_password}@{broker_host}//')

app.conf.update(
    task_serializer='json',
    accept_content=['json'],  # Ignore other content
    result_serializer='json',
    timezone='Europe/Paris',
    enable_utc=True,
)


@app.task
def scrap_video_metadata(video_id):
    request = youtube.videos().list(
        part="snippet,contentDetails,statistics,id,liveStreamingDetails,localizations,player,recordingDetails,status,topicDetails",
        id=video_id
    )
    response = request.execute()
    return {"type": "video_metadata", "video_id": video_id, "payload": response}


@app.task
def scrap_comment(video_id):
    request = youtube.commentThreads().list(
        part="snippet,replies",
        videoId=video_id
    )
    response = request.execute()
    return {"type": "comment", "video_id": video_id,
            "payload": [(item["snippet"]["topLevelComment"]["snippet"]["textDisplay"],
                         item["snippet"]["topLevelComment"]["snippet"]["likeCount"],
                         item["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"],
                         item["snippet"]["topLevelComment"]["snippet"]["publishedAt"]) for item in response["items"] if
                        item["kind"] == "youtube#commentThread"]}


@app.task
def scrap_captions(video_id):
    client = docker.DockerClient(base_url='unix://var/run/docker.sock')
    client.images.pull("stream4good/scrapping-robot-youtube-captions")
    try:
        return {"type": "captions", "video_id": video_id, "payload": str(
            client.containers.run("stream4good/scrapping-robot-youtube-captions", environment={"VIDEO_ID": video_id}))}
    except docker.errors.DockerException:
        return {"type": "captions", "video_id": video_id, "success":False}
