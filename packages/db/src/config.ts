import dotenv from 'dotenv';
import { toSnakeCase, toCamelCase } from './helper';
import {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  DB_CLIENT,
  DB_POOL_MIN,
  DB_POOL_MAX,
  DB_DISABLE_CASE_CONVERSION,
} from './constants'

dotenv.config();

const DCC = (DB_DISABLE_CASE_CONVERSION || false) as any;
const caseConversionOff = DCC === true || DCC === 'true';

const bufferToValue = (value: any): any => {
  if (!Buffer.isBuffer(value)) return value;
  return !!value.readInt8();
};

const touchItem = (item: any): any => {
  if (typeof item !== 'object') return item;
  const keys = Object.keys(item);
  return keys.reduce((carry, key) => {
    const field = caseConversionOff ? key : toCamelCase(key);
    const val = bufferToValue(item[key]);
    return { ...carry, [field]: val };
  }, {});
};

const postProcessResponse = (result: any[]): any[] => {
  if (caseConversionOff) return result;
  if (Array.isArray(result)) return result.map((item) => touchItem(item));
  return touchItem(result);
};

const wrapIdentifier = (value: any, origImpl: any): any => {
  if (caseConversionOff) return origImpl(value);
  const converted = value.replace(/[A-Z]/g, (char: string) => `_${char.toLowerCase()}`);
  return origImpl(toSnakeCase(converted));
};

export default {
  client: DB_CLIENT,
  connection: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  },
  pool: {
    min: Number(DB_POOL_MIN || 0),
    max: Number(DB_POOL_MAX || 50),
  },
  postProcessResponse,
  wrapIdentifier,
};
