import { Knex } from 'knex';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
  },
  migrations: {
    directory: './local/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './local/seeds',
    extension: 'ts',
  },
};

export default config;