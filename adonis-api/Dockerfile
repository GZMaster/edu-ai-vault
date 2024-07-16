FROM node:22 as base

# RUN apk --no-cache add curl

# All deps stage
FROM base as deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base as production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# Build stage
FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build --ignore-ts-errors

# Development stage
FROM base as dev
ENV NODE_ENV=development
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 3333
RUN npm install -g @adonisjs/cli
CMD ["node", "ace", "serve", "--hmr"]

# Production stage
FROM base as prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY ace ./ace
COPY package.json .
EXPOSE 8080
CMD ["node", "./build/server.js"]
