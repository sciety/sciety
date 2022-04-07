import axios from 'axios';
import { AxiosCacheInstance, buildStorage, setupCache } from 'axios-cache-interceptor';
import * as T from 'fp-ts/Task';
import { createClient } from 'redis';

export const createCachedAxios: T.Task<AxiosCacheInstance> = async () => {
  let cachedInstance;

  if (process.env.APP_CACHE === 'redis') {
    const client = createClient({
      socket: { host: 'sciety_cache' },
    });

    await client.connect();

    const redisStorage = buildStorage({
      async find(key) {
        const result = await client.get(`axios-cache:${key}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (result !== null ? JSON.parse(result) : undefined);
      },

      async set(key, value) {
        await client.set(`axios-cache:${key}`, JSON.stringify(value));
      },

      async remove(key) {
        await client.del(`axios-cache:${key}`);
      },
    });

    cachedInstance = setupCache(axios, { storage: redisStorage });
  } else {
    cachedInstance = setupCache(axios);
  }

  return (cachedInstance);
};
