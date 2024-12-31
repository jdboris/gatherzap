#syntax=docker/dockerfile:1.12-labs

FROM node:22.12.0-alpine AS base-stage

ARG ENVIRONMENT
ENV NODE_ENV=$ENVIRONMENT

ARG PORT
ENV PORT=$PORT

ARG CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY

ARG GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY

ARG COMING_SOON_MODE
ENV NEXT_PUBLIC_COMING_SOON_MODE=$COMING_SOON_MODE

FROM base-stage AS install-stage

COPY --parents /package*.json /**/package*.json /gatherzap/

WORKDIR /gatherzap/app/web

ENV NODE_ENV="development"
# RUN npm ci --unsafe-perm --install-links
RUN npm ci --unsafe-perm
ENV NODE_ENV=$ENVIRONMENT

WORKDIR /gatherzap/

# NOTE: Included for dependencies (shared code) in api service
COPY ./api ./api
COPY ./app ./app

WORKDIR /gatherzap/app/web

EXPOSE $PORT

# DEV STAGE
FROM install-stage AS dev-stage

CMD ["npm", "run", "dev"]

# PROD STAGE
FROM install-stage AS prod-stage

RUN npm run build

RUN npm prune --omit=dev

CMD ["npm", "run", "start"]

# CMD ["tail", "-f", "/dev/null"]