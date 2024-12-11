FROM node:22.4.0-alpine3.20 AS base-stage

ARG ENVIRONMENT
ENV NODE_ENV=$ENVIRONMENT

ARG PORT
ENV PORT=$PORT

WORKDIR /app

COPY package*.json .

RUN npm config set registry https://registry.npmjs.org/

ENV NODE_ENV="development"
RUN npm ci --unsafe-perm
ENV NODE_ENV=$ENVIRONMENT

COPY . .

EXPOSE $PORT

# DEV STAGE
FROM base-stage AS dev-stage

CMD ["npm", "run", "dev"]

# PROD STAGE
FROM base-stage AS prod-stage

RUN npm run build

RUN npm prune --omit=dev

CMD ["npm", "run", "start"]