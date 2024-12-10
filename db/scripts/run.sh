#!/bin/bash
source .env

docker container stop gatherzap-db
docker rm gatherzap-db
docker run \
  -d \
  -p $PORT:$PORT \
  -v "/$PWD/volumes/data":/var/lib/postgresql/data \
  --name gatherzap-db \
  -t gatherzap/db:1.0

$SHELL
