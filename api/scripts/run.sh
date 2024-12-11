#!/bin/bash
source .env

docker container stop gatherzap-api
docker rm gatherzap-api
docker run \
  -d \
  -p $PORT:$PORT \
  --name gatherzap-api \
  -t gatherzap/api:1.0

$SHELL
