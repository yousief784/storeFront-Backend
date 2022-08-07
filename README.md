# storeFront-Backend

The database schema and and API route found in the [REQUIREMENT.md](REQUIREMENTS.md)

### Scripts

-   Install: `npm i`
-   Build: `npm run build`
-   Eslint: `npm run lint`
-   Prettier: `npm run prettier`
-   Build and Run Unit Test: `npm run test`
-   Start ts server: `npm run dev`
-   Migrate database: `npm run migrate`
-   Reset database: `npm run migrate:reset`
-   to Build and start js server: `npm run startjs`

#### Notes

    Instead of handler Folder i use controller Folder

### Database Creation

```sh
# create user
CREATE USER username WITH SUPERUSER PASSWORD 'password';

# create Database
CREATE DATABASE store_dev;
CREATE DATABASE store_test;
```

### Database Migrations

```sh
# to create tables
npm run migrate
# to reset tables
npm run migrate:reset
```

### Environmental Variables (.env file contents)

```sh
# to connect with the database use the following environmental variables
  PORT ---> the server running on the port of 5000
  POSTGRES_HOST ---> the host (localhost)
  POSTGRES_PORT ---> database port (5432)
  POSTGRES_DB_DEV ---> dev database name (store_dev)
  POSTGRES_DB_TEST ---> test database name (store_test)
  POSTGRES_USER ---> username use database(username)
  POSTGRES_PASSWORD ---> password of the database(password)
  NODE_ENV ---> dev
  BCRYPT_PEPPER ---> pepper (your-secret-password)
  SALT_ROUND ---> salt rounds (10)
  TOKEN_SECRET ---> secret token (your-secret-token)

```
