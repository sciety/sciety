import { AxiosStorage, StorageValue, buildStorage } from 'axios-cache-interceptor';
import { createClient } from 'redis';
import { Logger } from '../shared-ports';

export const redisStorage = (
  client: ReturnType<typeof createClient>,
  maxAgeInMilliseconds: number,
  logger: Logger,
): AxiosStorage => buildStorage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(key, cacheRequestConfig) {
    const storageValue = await client
      .get(`axios-cache-${key}`)
      .then((result) => (result ? (JSON.parse(result) as StorageValue) : undefined));
    if (storageValue !== undefined) {
      logger('debug', 'Found key in the cache', { key });
    }
    return storageValue;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async set(key, value, cacheRequestConfig) {
    await client.set(`axios-cache-${key}`, JSON.stringify(value), {
      PX: maxAgeInMilliseconds,
    });
  },

  async remove(key) {
    await client.del(`axios-cache-${key}`);
  },
});
