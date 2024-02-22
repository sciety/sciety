import { LevelName, Payload } from './types';

type Entry = {
  timestamp: Date,
  level: LevelName,
  message: string,
  payload: Payload,
};

export type Serializer = (entry: Entry) => string;
