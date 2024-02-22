import rTracer from 'cls-rtracer';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { jsonSerializer } from './json-serializer';
import { Serializer } from './serializer';
import { Level, LevelName, Payload } from './types';

export type Logger = (level: LevelName, message: string, payload?: Payload, timestamp?: Date) => void;

const rTracerLogger = (logger: Logger): Logger => {
  const withRequestId = (payload: Payload) => pipe(
    O.of(rTracer.id()),
    O.fold(
      constant(payload),
      (requestId) => ({ ...payload, requestId }),
    ),
  );

  return (level, message, payload = {}) => (
    logger(level, message, withRequestId(payload))
  );
};

const streamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
  logLevelName: string,
): Logger => {
  const configuredLevel = Level[logLevelName as LevelName] ?? Level.debug;
  return (level, message, payload = {}, date = new Date()) => {
    if (Level[level] > configuredLevel) {
      return;
    }
    const entry = {
      timestamp: date,
      level,
      message,
      payload,
    };

    stream.write(`${serializer(entry)}\n`);
  };
};

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
