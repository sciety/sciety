import { LevelName, Payload } from './types.js';

type Entry = {
  timestamp: Date,
  level: LevelName,
  message: string,
  payload: Payload,
};

export type Serializer = (entry: Entry) => string;
