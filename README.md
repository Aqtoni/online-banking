# NestJS Swagger PostgreSQL TypeORM Docker

A Backend application based on NestJS, where PostgreSQL acts as a database to control the base
TypeORM is used. All this is packed in Docker-Compose.
All the most interesting is in the documentation. 📗

<table width="100%">
  <tr>
    <td align="center" valign="middle" width="17%">
      <a href="https://nestjs.com/">
        <img height="50" alt="NestJS" src="https://hsto.org/getpro/habr/post_images/d11/98b/ac8/d1198bac8e4ced0d89d5e5983061f418.png"/>
      </a>
      <br />
      NestJS
    </td>
    <td align="center" valign="middle" width="17%">
      <a href="https://www.postgresql.org/">
      <img height="50" alt="PostgresSQL" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/640px-Postgresql_elephant.svg.png"/>
      </a>
      <br />
      PostgresSQL
    </td>
    <td align="center" valign="middle" width="17%">
      <a href="https://typeorm.io/">
      <img height="50" alt="TypeORM" src="https://www.zoneofit.com/wp-content/uploads/2021/06/type-orm.png"/>
      </a>
      <br />
      TypeORM
    </td>
    <td align="center" valign="middle" width="17%">
      <a href="https://www.docker.com/">
      <img height="50" alt="Docker" src="https://d1.awsstatic.com/acs/characters/Logos/Docker-Logo_Horizontel_279x131.b8a5c41e56b77706656d61080f6a0217a3ba356d.png"/>
      </a>
      <br />
      Docker
    </td>
    <td align="center" valign="middle" width="17%">
      <a href="https://swagger.io/">
      <img height="50" alt="Swagger" src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Swagger-logo.png"/>
      </a>
      <br />
      Swagger
    </td>
  </tr>
</table>

## Key Features

- Authentication and Authorization
  - Login
- Transaction
  - Create a transaction and choose the category name and type of the transaction
  - There is also a choice of banks.
  - All transactions come to a separate webhook
- User
  - Create user, and update update and more. 
- Caching
- Rate Limiting
- Swagger documentation

## API Usage

You can run app and use `Swagger` on this link http://localhost/api.
Check [Online-Banking API Documentation](https://documenter.getpostman.com/view/25263444/2s93CUJAAj) for more info.

How to install webhook, you need get you on url, can use this site. And set the link.
[ngrok](https://ngrok.com/)
[webhook](https://webhook.site/)

## Installation and launch method

Create a repository at the root .env file, for example:

```dotenv
API_PORT=3001
TYPEORM_CONNECTION=postgres
TYPEORM_PORT=5432
TYPEORM_HOST=postgres
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=Bank
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=pgadmin
JWT_SECRET='you-secret'
JWT_EXPIRATION_TIME=600
THROTTLE_TTL=60
THROTTLE_LIMIT=20
WEBHOOK=your-webhook-link
```

### Using Docker

Follow the command:

```shell
docker-compose up
# -d - For launch in the background
# --build - for build containers
```
### Without Docker
- Install postgreSQL with an official [site](https://www.postgresql.org/)
- Create a server copy and database, add the user and password as indicated in the .env file
- Make sure PostgreSQL is launched and works
- Install dependencies

### Backend

```shell

# yarn package manager
yarn install
yarn start

# npm package manager
npm install
npm run start
```