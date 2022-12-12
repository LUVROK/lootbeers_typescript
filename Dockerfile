FROM node:lts-alpine as BUILD
WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./ ./
RUN yarn build

FROM nginx:alpine AS RUNNER
COPY --from=BUILD /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf