FROM  node:18 as build

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node . .

USER node 

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
