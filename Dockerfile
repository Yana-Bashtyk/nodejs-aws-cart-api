FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist /app/dist
EXPOSE 4000

ENV PORT=4000

CMD ["npm", "run", "start:prod"]