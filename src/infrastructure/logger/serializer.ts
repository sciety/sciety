import { Payload } from './types';
import { LogLevel } from '../../infrastructure-contract/log-level';

type Entry = {
  timestamp: Date,
  level: LogLevel,
  message: string,
  payload: Payload,
};

export type Serializer = (entry: Entry) => string;
