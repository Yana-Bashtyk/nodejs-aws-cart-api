FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=build /app/dist /app/dist
EXPOSE 4000

CMD ["npm", "run", "start:prod"]