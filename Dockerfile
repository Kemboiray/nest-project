FROM node:20.17.0

RUN npm install -g pnpm && \
    apt-get update && apt-get install -y wget && \
    wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["/bin/sh", "-c", "wait-for-it.sh mongodb:27017 -- pnpm start:prod"]
