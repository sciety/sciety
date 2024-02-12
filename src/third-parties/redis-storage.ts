import {
  AxiosStorage, StorageValue, buildStorage, NotEmptyStorageValue,
} from 'axios-cache-interceptor';
import { createClient } from 'redis';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Logger } from '../shared-ports';

const encode = (value: NotEmptyStorageValue) => JSON.stringify(value);

const decode = (value: string) => E.right(JSON.parse(value) as StorageValue);

export const redisStorage = (
  client: ReturnType<typeof createClient>,
  maxAgeInMilliseconds: number,
  logger: Logger,
): AxiosStorage => buildStorage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(key, cacheRequestConfig) {
    const result = await client.get(`axios-cache-${key}`);
    if (!result) {
      return undefined;
    }
    logger('debug', 'Found key in the cache', { key });
    return pipe(
      decode(result),
      E.getOrElseW(() => undefined),
    );
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
