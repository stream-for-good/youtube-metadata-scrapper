# Youtube-Metadata Scrapper

This microservice reads some videoId from the broker, gather info with youtube API and sends back results to the broker for persistence.
It uses [Python Celery](https://docs.celeryproject.org/en/stable/index.html) to run scrapping tasks on the server and [RabbitMQ](https://www.rabbitmq.com/) as a backend for messaging.

# Usage

first, you must fill up the `env.tpl` file and source it.

## in Python

### install requirements

```bash
pip3 install -f ./requirements.txt
```

### Standalone direct python (no celery required)

#### get video metadata
```
python -c "import youtube; youtube.scrap_video_metadata('8ED5zODbm38')"
```

#### get comments metadata

```
python -c "import youtube; youtube.scrap_comment('8ED5zODbm38')"
```

### calling celery tasks by hand

```python
import youtube
task=youtube.scrap_comment.delay("8ED5zODbm38")
while not task.ready():
  sleep(1)
result=task.get()
```

## Docker CLI

```bash
docker run -e API_KEY=foo1 -e BROKER_PASSWORD=foo2 -e BROKER_USER=foo3 -e BROKER_HOST=foo4 stream4good/youtube-metadata-scrapper
```

## Docker compose

```yaml
image: stream4good/youtube-metadata-scrapper
environment: 
 - API_KEY=foo1
 - BROKER_PASSWORD=foo2
 - BROKER_USER=foo3 
 - BROKER_HOST=foo4
```



# PHP client

This php client is provided as an example to call celery task from php.

# Getting the results

Results are pushed in the [broker](https://broker-s4g.miage.dev/), in the [youtube-response queue](https://broker-s4g.miage.dev/#/queues/%2F/youtube-response).
