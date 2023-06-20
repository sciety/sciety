import axios from 'axios';
import * as A from 'fp-ts/Array';
import { flow, pipe } from 'fp-ts/function';
import { serializeError } from 'serialize-error';
import { FlushLogs } from '../shared-ports/logger';

enum Level {
  error,
  warn,
  info,
  debug,
}

export type LevelName = keyof typeof Level;

export type Payload = Record<string, unknown>;

export type Logger = (level: LevelName, message: string, payload?: Payload, timestamp?: Date) => void;

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

const filterAxiosGarbageInPayload = (payload: Payload) => {
  if (payload.error && axios.isAxiosError(payload.error)) {
    return ({
      ...payload,
      error: {
        url: payload.error.config ? payload.error.config.url : 'url-not-available',
        status: payload.error.response?.status,
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

export type Config = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
};

type LogFuncs = {
  logger: Logger,
  flushLogs: FlushLogs,
};

export const createLogger = (dependencies: Config): LogFuncs => {
  let logs: Array<Entry> = [];
  return ({
    logger: (level, message, payload = {}, date = new Date()) => {
      const configuredLevel = Level[dependencies.logLevel as LevelName] ?? Level.debug;
      if (Level[level] > configuredLevel) {
        return;
      }
      logs.push({
        timestamp: date,
        level,
        message,
        payload,
      });
    },
    flushLogs: () => {
      process.stdout.write('\n');
      pipe(
        logs,
        A.map((entry) => {
          process.stdout.write(`${jsonSerializer(dependencies.prettyLog)(entry)}\n`);
          return entry;
        }),
      );
      process.stdout.write('\n');
      logs = [];
    },
  });
};
