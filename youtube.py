import s4gpy
import celery

from celery import Celery
import os

import google_auth_oauthlib
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors

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
        part="contentDetails,snippet",
        id=video_id
    )
    response = request.execute()

    video_info = [x["snippet"] for x in filter(lambda x: x["kind"] == "youtube#video", response["items"])][0]
    print(video_info)
    return video_info


@app.task
def scrap_comment(video_id):
    request = youtube.commentThreads().list(
        part="snippet,replies",
        videoId=video_id
    )
    response = request.execute()
    return [(item["snippet"]["topLevelComment"]["snippet"]["textDisplay"],
             item["snippet"]["topLevelComment"]["snippet"]["likeCount"]) for item in response["items"] if
            item["kind"] == "youtube#commentThread"]
