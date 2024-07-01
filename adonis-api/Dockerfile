FROM node:20.12.2-alpine3.18 as base

# All deps stage
FROM base as deps
WORKDIR /
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base as production-deps
WORKDIR /
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base as build
WORKDIR /
COPY --from=deps /node_modules /node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /
COPY --from=production-deps /node_modules /node_modules
COPY --from=build /build /
EXPOSE 8080
CMD ["node", "./bin/server.js"]
