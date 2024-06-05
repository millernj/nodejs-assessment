import dotenv from 'dotenv';

enum Environments {
  Dev = 'dev',
  Test = 'test',
  Acceptance = 'acceptance',
  Staging = 'staging',
  Production = 'production',
}

// load env from a .env file if there is one
dotenv.config()

const devOverrides = {
  NODE_ENV:    Environments.Dev,
  HOST:        'localhost',
  PORT:         3000,
  CORS_ORIGIN: 'http://localhost:3000'
};

const useDevOverrides = !process.env.NODE_ENV || Environments.Dev === process.env.NODE_ENV as Environments;

export const env = useDevOverrides ? { ...process.env, ...devOverrides } : process.env;
