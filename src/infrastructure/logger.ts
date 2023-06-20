/* eslint-disable object-curly-newline */
import axios from 'axios';
import { serializeError } from 'serialize-error';
import { FlushLogs, Logger } from '../shared-ports/logger';

enum Level {
  error,
  warn,
  info,
  debug,
}

export type LevelName = keyof typeof Level;

export type Payload = Record<string, unknown>;

type Entry = {
  timestamp: Date,
  level: LevelName,
  message: string,
  payload: Payload,
};

type LogAccumulator = {
  timestamp: Date,
  level: LevelName,
  message: string,
  payload: Array<Entry>,
};

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

const jsonSerializer = (prettyPrint = false) => (entry: LogAccumulator) => (
  JSON.stringify(entry, replaceError, prettyPrint ? 2 : undefined)
);

export type Config = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
};

const emptyLog: LogAccumulator = {
  timestamp: new Date(),
  level: 'info',
  message: 'Log start',
  payload: [],
};

type LogFuncs = {
  logger: Logger,
  flushLogs: FlushLogs,
};

export const createLogger = (dependencies: Config): LogFuncs => {
  let accumulator = emptyLog;
  return ({
    logger: (level, message, payload = {}, timestamp = new Date()) => {
      const configuredLevel = Level[dependencies.logLevel as LevelName] ?? Level.debug;
      if (Level[level] > configuredLevel) {
        return;
      }
      const log = { timestamp, level, message, payload: filterAxiosGarbageInPayload(payload) };
      if (accumulator.payload.length === 0) {
        accumulator = { timestamp, level, message, payload: [log] };
      } else {
        if (Level[level] < Level[accumulator.level]) {
          accumulator.level = level;
          accumulator.message = message;
        }
        accumulator.payload.push(log);
      }
    },
    flushLogs: () => {
      if (accumulator.payload.length > 0) {
        process.stdout.write(`${jsonSerializer(dependencies.prettyLog)(accumulator)}\n`);
      }
      accumulator = emptyLog;
    },
  });
};
