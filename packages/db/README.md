# Database

Database package is Query Builder layer
over the KnexJS (https://knexjs.org) query builder
with extended functions.

## Configuration

By default, to initialize the `@ts/db` package,
you can simply define the environment variables
with the following: 

```dotenv
  DB_HOST= localhost
  DB_PORT= 5432
  DB_USER= root
  DB_PASSWORD= root
  DB_DATABASE= test

  DB_POOL_MIN= 0
  DB_POOL_MAX= 50
  DB_CLIENT= pg
  DB_TIMEOUT= 50000

  DB_MIGRATION_TABLE_NAME= db_migrations
  DB_MIGRATION_DIRECTORY= ./database/migrations
  DB_SEED_DIRECTORY= ./database/seeds

  DB_DISABLE_CASE_CONVERSION= false

  DB_PAGINATION_PAGE_SIZE= 20
```

or, manually configure while importing
and provide the detail configuration informamtion
as the following:

```ts
  import db from '@ts/db'
  
  const pool = db({
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'pguser',
      password': 'pgpassword',
      database: 'pg-db'
    },
    pool: { min: 0, max: 50 },
    client: 'pg'
  });
```

## Migration

To run migration, you need to create a migration
configuration, where extends from the database
configureation, normally from default pool configuration.
