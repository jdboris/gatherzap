#!/bin/bash
source .env

docker build \
  --target prod-stage \
  -t gatherzap/api:1.0 \
  --build-arg ENVIRONMENT="production" \
  --build-arg PORT=$PORT \
  .

$SHELL
