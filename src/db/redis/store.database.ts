import RedisStore from "connect-redis";
import session, { Store } from "express-session";
import { createClient, RedisClientType } from 'redis';


export default async function redisStore(prefix?: string): Promise<Store | undefined> {
  // Initialize client.
  let redisClient = createClient({ url: process.env["REDIS_URL"] });
  return redisClient.connect().then(() => {
    // Initialize store.
    return new RedisStore({
      client: redisClient,
      prefix: prefix ?? "Bearer ",
    });
  }).catch((error) => {
    console.error("Redis:", error.code, "=> Express-session on memory!");
    return undefined; // "MemoryStore"
  });
};


