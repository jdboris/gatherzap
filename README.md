# gatherzap

# Development

## Prerequisites

1. Clone the repo
2. Insall and run [Docker Desktop](https://docs.docker.com/desktop)
3. Create `.env`...

   ```
   ENVIRONMENT=...                        # "development" or "production"
   APP_PORT=...                           # The web app service port (i.e. 80)
   API_PORT=...                           # The back-end app service port (i.e. 3000)
   PGADMIN_PORT=...                       # The pgadmin port (i.e. 8080)

   DATABASE_NAME=...
   DATABASE_PASSWORD=...
   ADMIN_EMAIL=...
   ADMIN_PASSWORD=...

   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...  # See Clerk docs
   CLERK_SECRET_KEY=...                   # See Clerk docs

   GOOGLE_MAPS_API_KEY=...                # See Google Maps docs
   ```

## Run

```
./scripts/run.sh
```
