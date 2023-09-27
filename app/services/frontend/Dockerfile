FROM node:lts-alpine as build-stage

WORKDIR /app
ENV BASE_URL=/boris_frontend/

COPY package.json .

RUN npm cache clean --force

RUN npm i

COPY ./ .

RUN npm run build

FROM nginx as production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]