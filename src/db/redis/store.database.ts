import RedisStore from "connect-redis";
import session, { Store } from "express-session";
import { createClient, RedisClientType } from 'redis';


export default function redisStore(prefix?: string): Store | undefined {
  if (!!process["redis"])
    // Initialize store.
    return new RedisStore({
      client: process["redis"],
      prefix: prefix ?? "Bearer ",
    })
  console.error("X Express-session on memory!");
  return undefined;
};


