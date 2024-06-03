import dotenv from 'dotenv';

dotenv.config()

const devDefaults = {
  NODE_ENV: 'test',
  HOST: 'localhost',
  PORT: 3000,
  CORS_ORIGIN: 'http://localhost:3000'
};

export const env = ['acceptance', 'staging', 'production'].includes(process.env.NODE_ENV as string) ? process.env : { ...process.env, ...devDefaults };
