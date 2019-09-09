import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

export const DB_HOST = process.env.DB_HOST || 'http://localhost';
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER || 'test-read';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
export const DB_NAME = process.env.DB_NAME || 'localdb';
export const DB_TABLE = process.env.DB_TABLE || 'events';

export const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || 'http://localhost:3000'