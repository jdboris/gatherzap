docker compose --progress=plain -p gatherzap --profile development -f docker-compose.yml -f docker-compose.dev.yml build &&
  docker compose --progress=plain -p gatherzap --profile development -f docker-compose.yml -f docker-compose.dev.yml up --watch
