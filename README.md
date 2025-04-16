## Description

[Nest](https://github.com/nestjs/nest) Microservice framework service TypeScript repository.

## Installation

```bash
$ yarn v1.22.22
$ node v18.16.0
$ prisma v5.10.0
$ typescript ^5.4
$ nest v9.0.0


```

## Database

PostgreSQL v17.4
Redis v7.4.2
RabbitMQ v3.11.1

```bash
# generate schema
$ yarn generate

# migrate dev
$ yarn migrate

# migrate prod
$ yarn migrate:prod
```

## Running the app

```bash
# development
$ yarn dev

# production mode
$ yarn start
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

Nest is [MIT licensed](LICENSE).
