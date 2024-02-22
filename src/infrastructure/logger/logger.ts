import axios, { AxiosError } from 'axios';
import rTracer from 'cls-rtracer';
import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import { serializeError } from 'serialize-error';

enum Level {
  error,
  warn,
  info,
  debug,
}

export type LevelName = keyof typeof Level;

export type Payload = Record<string, unknown>;

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

type Entry = {
  timestamp: Date,
  level: LevelName,
  message: string,
  payload: Payload,
};

type Serializer = (entry: Entry) => string;

export const replaceError = (_key: string, value: unknown): unknown => {
  if (_key === 'Authorization' || _key === 'Crossref-Plus-API-Token') {
    return '--redacted--';
  }
  if (value instanceof Error) {
    return serializeError(value);
  }
  return value;
};

const interpretAxiosStatus = (error: AxiosError<unknown, unknown>) => {
  if (error.response?.status) {
    return error.response.status;
  }
  if (error.code === 'ETIMEDOUT') {
    return 'timeout';
  }
  return 'status-code-not-available';
};

const filterAxiosGarbageInPayload = (payload: Payload) => {
  if (payload.error && axios.isAxiosError(payload.error)) {
    return ({
      ...payload,
      error: {
        url: payload.error.config ? payload.error.config.url : 'url-not-available',
        status: interpretAxiosStatus(payload.error),
        name: payload.error.name,
        message: payload.error.message,
      },
    });
  }

  return payload;
};

const jsonSerializer = (prettyPrint = false): Serializer => flow(
  (entry) => ({
    ...entry,
    payload: filterAxiosGarbageInPayload(entry.payload),
  }),
  (entry) => (
    JSON.stringify(entry, replaceError, prettyPrint ? 2 : undefined)
  ),
);

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
