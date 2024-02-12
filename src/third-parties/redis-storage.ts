import {
  AxiosStorage, StorageValue, buildStorage, NotEmptyStorageValue,
} from 'axios-cache-interceptor';
import { createClient } from 'redis';
import { Logger } from '../shared-ports';

const encode = (value: NotEmptyStorageValue) => JSON.stringify(value);

const decode = (value: string) => JSON.parse(value) as StorageValue;

export const redisStorage = (
  client: ReturnType<typeof createClient>,
  maxAgeInMilliseconds: number,
  logger: Logger,
): AxiosStorage => buildStorage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(key, cacheRequestConfig) {
    const storageValue = await client
      .get(`axios-cache-${key}`)
      .then((result) => (result ? decode(result) : undefined));
    if (storageValue !== undefined) {
      logger('debug', 'Found key in the cache', { key });
    }
    return storageValue;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async set(key, value, cacheRequestConfig) {
    await client.set(`axios-cache-${key}`, encode(value), {
      PX: maxAgeInMilliseconds,
    });
  },

  async remove(key) {
    await client.del(`axios-cache-${key}`);
  },
});
