import { pipe } from 'fp-ts/function';
import { jsonSerializer } from './json-serializer.js';
import { Logger } from './types.js';
import { rTracerLogger } from './r-tracer-logger.js';
import { streamLogger } from './stream-logger.js';

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
