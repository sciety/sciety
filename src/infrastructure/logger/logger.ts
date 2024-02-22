import { pipe } from 'fp-ts/function';
import { jsonSerializer } from './json-serializer';
import { Logger } from './types';
import { rTracerLogger } from './r-tracer-logger';
import { streamLogger } from './stream-logger';

export type Config = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
};

export const createLogger = (dependencies: Config): Logger => pipe(
  dependencies.prettyLog,
  jsonSerializer,
  (serializer) => streamLogger(process.stdout, serializer, dependencies.logLevel),
  rTracerLogger,
);
