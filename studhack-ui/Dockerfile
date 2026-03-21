FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.29-alpine

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/runtime-config.template.js /opt/studhack/runtime-config.template.js
COPY docker/entrypoint/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

COPY --from=build /app/dist/studhack-ui/browser /usr/share/nginx/html

EXPOSE 80
