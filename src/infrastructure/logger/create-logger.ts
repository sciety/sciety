import { pipe } from 'fp-ts/function';
import { jsonSerializer } from './json-serializer';
import { rTracerLogger } from './r-tracer-logger';
import { streamLogger } from './stream-logger';
import { Logger } from '../../infrastructure-contract';

export type Config = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
};

export const createLogger = (config: Config): Logger => pipe(
  config.prettyLog,
  jsonSerializer,
  (serializer) => streamLogger(process.stdout, serializer, config.logLevel),
  rTracerLogger,
);
