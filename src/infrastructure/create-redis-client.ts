import { createClient } from 'redis';
import { Logger } from '../shared-ports';

export const createRedisClient = async (logger: Logger): Promise<ReturnType<typeof createClient> | undefined> => {
  let redisClient: ReturnType<typeof createClient> | undefined;
  if (process.env.APP_CACHE === 'redis') {
    logger('info', 'Using redis as application cache', { cacheHost: process.env.CACHE_HOST });
    redisClient = createClient({
      url: `redis://${process.env.CACHE_HOST ?? ''}`,
    });
    redisClient.on('ready', () => {
      logger('info', 'Redis client is ready');
    });
    redisClient.on('error', (error) => {
      logger('error', 'Redis client has encountered an error', { error });
      throw error;
    });
    await redisClient.connect();
  } else {
    logger('info', 'Using local memory as application cache');
  }
  return redisClient;
};
