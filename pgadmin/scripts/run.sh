#!/bin/bash
source .env

docker container stop gatherzap-pgadmin
docker rm gatherzap-pgadmin
docker run \
  -d \
  -p $PORT:$PORT \
  -v "/$PWD/data":/var/lib/pgadmin \
  --name gatherzap-pgadmin \
  -t gatherzap/pgadmin:1.0

$SHELL
