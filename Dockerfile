FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN \
  yarn install --loglevel warn &&\
  yarn build

CMD [ "yarn", "--cwd=/usr/src/app", "start"]


