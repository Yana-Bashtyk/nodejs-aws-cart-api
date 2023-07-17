FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

FROM node:16-alpine AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /app/dist /app/dist
ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]