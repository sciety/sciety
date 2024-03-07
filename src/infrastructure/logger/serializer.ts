import { Payload } from './types';
import { LevelName } from '../../shared-ports/logger';

type Entry = {
  timestamp: Date,
  level: LevelName,
  message: string,
  payload: Payload,
};

export type Serializer = (entry: Entry) => string;
