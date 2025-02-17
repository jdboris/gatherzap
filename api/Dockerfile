#syntax=docker/dockerfile:1.12-labs

FROM node:22.12.0-alpine AS base-stage

ARG ENVIRONMENT
ENV NODE_ENV=$ENVIRONMENT

ARG PORT
ENV PORT=$PORT

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG CLERK_SECRET_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

ARG CLERK_PUBLISHABLE_KEY
ENV CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY

ARG COMING_SOON_MODE
ENV COMING_SOON_MODE=$COMING_SOON_MODE

FROM base-stage AS install-stage

COPY --parents /package*.json /**/package*.json /gatherzap/

WORKDIR /gatherzap/api

ENV NODE_ENV="development"
RUN npm ci --unsafe-perm
ENV NODE_ENV=$ENVIRONMENT

WORKDIR /gatherzap/

COPY ./api ./api

WORKDIR /gatherzap/api

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