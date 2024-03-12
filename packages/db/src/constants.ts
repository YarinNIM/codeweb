import dotenv from 'dotenv';

dotenv.config();

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USER = process.env.DB_USER || 'test';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_DATABASE = process.env.DB_DATABASE || 'test';
export const DB_CLIENT = process.env.DB_CLIENT || 'pg';

export const DB_POOL_MIN = process.env.DB_POOL_MIN || 0;
export const DB_POOL_MAX = process.env.DB_POOL_MAX || 50;

export const DB_PAGINATION_PAGE_SIZE= process.env.DB_PAGINATION_PAGE_SIZE || 20;
export const DB_DISABLE_CASE_CONVERSION = process.env.DB_DISABLE_CASE_CONVERSION || false;
