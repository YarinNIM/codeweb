export { Knex as Query } from 'knex';

type Connection = {
  host?: string,
  port?: number,
  user?: string,
  password?: string,
  database?: string,
  typeCase?: any,
};

type Pool = {
  min: number,
  max: number,
};

type Migration = {
  tableName?: string,
  directory?: string,
  extension?: string,
}

type Seed = {
  directory?: string,
};

export type Config = {
  connection?: Connection
  client?: string,
  pool?: Pool,
  migrations?: Migration,
  seeds?: Seed,
};
