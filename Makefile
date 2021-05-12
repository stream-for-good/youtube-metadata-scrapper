IMAGE_NAME="stream4good/youtube-metadata-scrapper"
VERSION=$(shell git describe --tags)
VERSION_MAJOR=$(shell git describe --tags|sed -rn 's/([0-9]+)\..*/\1/p')
VERSION_MAJOR_MINOR=$(shell git describe --tags|sed -rn 's/([0-9]+\.[0-9]+)\..*/\1/p')
docker-build-testing:
	docker build . -t $(IMAGE_NAME):testing
	docker build . -t $(IMAGE_NAME):latest
docker-push-testing:
	docker push $(IMAGE_NAME):testing
docker-build-release:
	docker build . -t $(IMAGE_NAME):$(VERSION)
docker-push-release:
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):$(VERSION_MAJOR)
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):$(VERSION_MAJOR_MINOR)
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):release
	docker push $(IMAGE_NAME):$(VERSION)
	docker push $(IMAGE_NAME):$(VERSION_MAJOR)
	docker push $(IMAGE_NAME):$(VERSION_MAJOR_MINOR)
	docker push $(IMAGE_NAME):release

run:
	docker run -e API_KEY=${API_KEY} -e BROKER_PASSWORD=${BROKER_PASSWORD} -e BROKER_USER=${BROKER_USER} -e BROKER_HOST=${BROKER_HOST} stream4good/youtube-metadata-scrapper -l debuggi

