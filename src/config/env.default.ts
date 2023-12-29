export type DefaultEnv = {
  PORT_HTTP: string
  PORT_HTTPS: string
  HOST: string
  BASE_URL: string
  MONGODB_URL: string
  REDIS_URL: string
  SESSION_SECRET: string
  REQUEST_LOG_FORMAT: string
  NODE_ENV: "development" | "production"
  REQUEST_LOG_DIR: string
}

const defaults: DefaultEnv = {
  "NODE_ENV": "development",
  "PORT_HTTP": "4000",
  "PORT_HTTPS": "3000",
  "HOST": "127.0.0.1",
  "BASE_URL": "127.0.0.1:3000/api/v1",
  "MONGODB_URL": "mongodb://localhost:27017/test",
  "REDIS_URL": "redis://localhost:6379",
  "REQUEST_LOG_FORMAT": "",
  "REQUEST_LOG_DIR": "../logs",
  "SESSION_SECRET": "M<Y$N0A=MHEqIvS,D#E!V!M]OWL/AiV4i",
};
export default defaults;