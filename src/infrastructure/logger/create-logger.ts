import { pipe } from 'fp-ts/function';
import { jsonSerializer } from './json-serializer';
import { Logger } from './types';
import { rTracerLogger } from './r-tracer-logger';
import { streamLogger } from './stream-logger';

export type Config = {
  prettyLog: boolean,
  minimumLogLevel: string, // TODO: Make this a level name
};

export const createLogger = (config: Config): Logger => pipe(
  config.prettyLog,
  jsonSerializer,
  (serializer) => streamLogger(process.stdout, serializer, config.minimumLogLevel),
  rTracerLogger,
);
