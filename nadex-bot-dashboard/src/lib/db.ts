import 'server-only';

import Redis, { RedisOptions } from 'ioredis';

if (!process.env.REDIS_PORT || !process.env.REDIS_HOST) {
	console.error('Redis connection details are not provided.');
  process.exit(1);
}
class RedisClient {
  private static instance: RedisClient;
  private redis: Redis;

  private constructor(options: RedisOptions) {
    this.redis = new Redis(options);

    this.redis.on('error', (err) => {
      console.error('Error connecting to Redis:', err);
    });
  }

  public static getInstance(): RedisClient {
    if (!this.instance) {
      const options: RedisOptions = {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
				password: process.env.REDIS_PASSWORD,
				username:process.env.REDIS_USERNAME
      };
      this.instance = new RedisClient(options);
    }
    return this.instance;
  }

  public getClient(): Redis {
    return this.redis;
  }
}

export const redisInstance = RedisClient.getInstance().getClient();

redisInstance.on("connect",() => {
	console.log("redis is connected")
})
