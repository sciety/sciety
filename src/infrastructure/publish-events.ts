import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Redis } from 'ioredis';
import { RuntimeGeneratedEvent } from '../domain-events';
import { domainEventCodec } from '../types/codecs/DomainEvent';

const publish = (redis: Redis) => (payload: string): T.Task<number> => async () => redis.publish('sciety-events', payload);

export const publishEvents = (redis: Redis) => (event: RuntimeGeneratedEvent): T.Task<number> => pipe(
  event,
  domainEventCodec.encode,
  (encoded) => JSON.stringify(encoded),
  publish(redis),
);
