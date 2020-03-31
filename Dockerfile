FROM node:13.8.0 as builder
WORKDIR /usr/src/app

ARG BUILD_API_URL

ENV API_URL=$BUILD_API_URL

COPY src/ src/
COPY package.json ./
COPY webpack* ./
COPY yarn.lock ./
COPY .babelrc ./
COPY postcss.config.js ./

RUN yarn && yarn prod --prod

FROM nginx:latest
COPY --from=builder /usr/src/app/dist /var/www
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]