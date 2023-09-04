## Description
API built using NestJS and Typescript to get the mid price 
and orderbook from websocket streams of Binance, Huobi and Kraken.

### Features
1. Base class architecture for easy integration of new exchanges
2. Data verification for valid orderbook and stale orderbook
3. Auto recovery on invalid data / connection failure
4. Available in REST and Websocket (see demo section)
5. Unit tests and github actions integration
6. Dockerized and deployed to GCP

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Docker

```bash
# build docker image
$ yarn docker:build

# run docker container in local
$ yarn docker:run

# deploy image to gcp
$ yarn docker:deploy
```

## Demo

### REST API
To get mid price\
https://orderbook-api-uysefov3oq-od.a.run.app/orderbook/midprice

To get full orderbook\
https://orderbook-api-uysefov3oq-od.a.run.app/orderbook/orderbook

### Websocket
https://orderbook-api-uysefov3oq-od.a.run.app\
Events: midprice, orderbook
