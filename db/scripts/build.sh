#!/bin/bash
source .env

docker build \
  -t gatherzap/db:1.0 \
  --build-arg PORT=$PORT \
  --build-arg PASSWORD=$PASSWORD \
  --build-arg DATABASE_NAME=$DATABASE_NAME \
  .

$SHELL
