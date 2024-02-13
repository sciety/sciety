import {
  AxiosStorage, StorageValue, buildStorage,
} from 'axios-cache-interceptor';
import { createClient } from 'redis';
import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { Logger } from '../../shared-ports';

export const encode = (value: StorageValue): string => JSON.stringify(value);

export const decode = (value: string): E.Either<unknown, StorageValue> => pipe(
  E.tryCatch(
    () => JSON.parse(value) as StorageValue,
    identity,
  ),
);

const constructRedisKey = (requestKey: string) => `sciety-cache-${requestKey}`;

export const redisStorage = (
  client: ReturnType<typeof createClient>,
  maxAgeInMilliseconds: number,
  logger: Logger,
): AxiosStorage => buildStorage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(requestKey, cacheRequestConfig) {
    const redisKey = constructRedisKey(requestKey);
    const result = await client.get(redisKey);
    if (!result) {
      return undefined;
    }
    return pipe(
      decode(result),
      E.mapLeft((error) => {
        logger('error', 'Decoding cached value failed', { requestKey, redisKey, error });
        return error;
      }),
      E.getOrElseW(() => undefined),
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async set(requestKey, value, cacheRequestConfig) {
    const redisKey = constructRedisKey(requestKey);
    logger('debug', 'Storing third party data in the cache', { requestKey, redisKey });
    await client.set(redisKey, encode(value), {
      PX: maxAgeInMilliseconds,
    });
  },

  async remove(requestKey) {
    const redisKey = constructRedisKey(requestKey);
    logger('debug', 'Removing third party data from the cache', { requestKey, redisKey });
    await client.del(redisKey);
  },
});
