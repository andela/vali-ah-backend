import { config as getEnv } from 'dotenv';

getEnv();

const databaseUrls = {
  development: process.env.DATABASE_URL,
  staging: process.env.DATABASE_URL,
  test: process.env.DATABASE_TEST_URL,
  production: process.env.DATABASE_URL
};

const environment = process.env.NODE_ENV || 'development';

export const url = databaseUrls[environment];

const devMode = (environment !== 'production');

export const config = {
  dialect: 'postgres',
  logging: devMode ? log => log : false,
  operatorsAliases: false,
};
