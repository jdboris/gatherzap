FROM node:22.12.0-alpine AS base-stage

ARG ENVIRONMENT
ENV NODE_ENV=$ENVIRONMENT

ARG PORT
ENV PORT=$PORT

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ARG GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY

WORKDIR /app/web

COPY ./web/package*.json .

RUN npm config set registry https://registry.npmjs.org/

ENV NODE_ENV="development"
RUN npm ci --unsafe-perm
ENV NODE_ENV=$ENVIRONMENT

WORKDIR /app
COPY . .
WORKDIR /app/web

EXPOSE $PORT

# DEV STAGE
FROM base-stage AS dev-stage

CMD ["npm", "run", "dev"]

# PROD STAGE
FROM base-stage AS prod-stage

RUN npm run build

RUN npm prune --omit=dev

CMD ["npm", "run", "start"]