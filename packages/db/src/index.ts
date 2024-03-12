import dotenv from 'dotenv';
import base, { type Knex } from 'knex';
import dbConfig from './config';
import initPaginate from './paginate';
import initSearch from './search';
import initFind from './find';
import { Config } from './types';

dotenv.config();

export const defaultConfig = dbConfig;

let QueryBuilder:any;

try {
  QueryBuilder = require('knex/src/query/builder');
} catch (error: any) {
  QueryBuilder = require('knex/lib/query/querybuilder');
}

export default function connect(pProps: Config = {}): any {
  const props: any = { ...dbConfig, ...pProps };
  initPaginate(QueryBuilder);
  initSearch(QueryBuilder);
  initFind(QueryBuilder);
  return base(props);
}

export const getConfig = (pool: any): any => pool
  .connection()
  .client
  .config;

export const createModel = (pool: any, tableName: string) => (trx: any = false) => trx
  ? pool(tableName).transacting(trx)
  : pool(tableName);

export { Knex } from 'knex';
