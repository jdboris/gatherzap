#!/bin/bash
source .env

docker build \
  --target dev-stage \
  -t gatherzap/api:1.0 \
  --build-arg ENVIRONMENT="development" \
  --build-arg PORT=$PORT \
  .

$SHELL
