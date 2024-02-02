import { createClient, RedisClientType } from 'redis';

// Connect to the database 
async function connect(dbUri: string) {
    //create redis client
    const client: RedisClientType = createClient({ url: dbUri });
    //connect to redis
    return client.connect().then(() => {
        console.log('Connected to Redis');
        return client;
    }).catch(err => {
        console.log('Redis Connection : ' + err);
        return undefined;
    });
};

export default connect;
