# gatherzap

# Development

## Prerequisites

1. Clone the repo
2. Insall and run [Docker Desktop](https://docs.docker.com/desktop)
3. Create `.env`...

   ```
   ENVIRONMENT=...        # "development" or "production"
   APP_PORT=...           # The web app service port (i.e. 80)
   API_PORT=...           # The back-end app service port (i.e. 3000)
   PGADMIN_PORT=...       # The pgadmin port (i.e. 8080)

   DATABASE_NAME=...
   DATABASE_PASSWORD=...
   ADMIN_EMAIL=...
   ADMIN_PASSWORD=...
   ```

## Run

```
./scripts/run.sh
```
