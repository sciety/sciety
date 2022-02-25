import Redis from 'ioredis';
import { Logger } from '../infrastructure/logger';
import { List } from '../shared-read-models/lists';
import { GroupId } from '../types/group-id';

type ListsReadModel = Map<GroupId, List>;

type ListenForNewEvents = (logger: Logger, persisted: ListsReadModel) => void;

export const listenForNewEvents: ListenForNewEvents = (logger) => {
  const redis = new Redis(6379, 'cache');

  redis.subscribe('sciety-events', (err, count) => {
    if (err) logger('error', 'Failed to subscribe to redis channel', { message: err.message });
    logger('info', 'Subscribed to redis channel', { subscribedChannelCount: count });
  });

  redis.on('message', (channel: string, message) => {
    logger('debug', 'Received message', { channel, message: JSON.parse(message) });
  });
};
