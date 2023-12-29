import { IConsumer } from "./interfaces/kafka.interface";

export { };
declare global {
  namespace NodeJS {
    // interface Process {
    // }
    interface ProcessEnv {
      PORT_HTTP: string
      PORT_HTTPS: string
      HOST: string
      BASE_URL: string
      MONGODB_URL: string
      REDIS_URL: string
      SESSION_SECRET: string
      REQUEST_LOG_FORMAT: string
      NODE_ENV: "development" | "production"
      REQUEST_LOG_FILE: string
    }
  }
}
