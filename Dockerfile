FROM node:16-alpine3.12 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

EXPOSE 3000
CMD ["sirv", "public", "--no-clear", "-s", "--host", "0.0.0.0:3000"]