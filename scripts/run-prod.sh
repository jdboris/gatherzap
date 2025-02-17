#!/bin/bash
source .env.production

docker compose --progress=plain -p gatherzap --profile $ENVIRONMENT --env-file .env.production -f docker-compose.yml build &&
  docker compose --progress=plain -p gatherzap --profile $ENVIRONMENT --env-file .env.production -f docker-compose.yml up --watch

$SHELL
