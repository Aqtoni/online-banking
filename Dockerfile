FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY [ "package.json", "yarn.lock*", "./" ]

RUN yarn install --frozen-lockfile

COPY . .

CMD ["node", "/usr/src/app/main"]

