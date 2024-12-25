source .env

docker compose --progress=plain -p gatherzap --profile $ENVIRONMENT -f docker-compose.yml $([ "$ENVIRONMENT" = "development" ] && echo "-f docker-compose.dev.yml") build &&
  docker compose --progress=plain -p gatherzap --profile $ENVIRONMENT -f docker-compose.yml $([ "$ENVIRONMENT" = "development" ] && echo "-f docker-compose.dev.yml") up --watch

$SHELL
