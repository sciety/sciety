/* eslint-disable object-curly-newline */
import axios from 'axios';
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

type Current = {
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

const jsonSerializer = (prettyPrint = false) => (entry: Current) => (
  JSON.stringify(entry, replaceError, prettyPrint ? 2 : undefined)
);

export type Config = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
};

type LogFuncs = {
  logger: Logger,
  flushLogs: FlushLogs,
};

const initial: Current = {
  timestamp: new Date(),
  level: 'info',
  message: 'Log start',
  payload: [],
};

export const createLogger = (dependencies: Config): LogFuncs => {
  let current = initial;
  return ({
    logger: (level, message, payload = {}, timestamp = new Date()) => {
      const configuredLevel = Level[dependencies.logLevel as LevelName] ?? Level.debug;
      if (Level[level] > configuredLevel) {
        return;
      }
      const log = { timestamp, level, message, payload: filterAxiosGarbageInPayload(payload) };
      if (current.payload.length === 0) {
        current = {
          timestamp,
          level,
          message,
          payload: [log],
        };
      } else {
        if (Level[level] < Level[current.level]) {
          current.level = level;
          current.message = message;
        }
        current.payload.push(log);
      }
    },
    flushLogs: () => {
      if (current.payload.length > 0) {
        process.stdout.write(`${jsonSerializer(dependencies.prettyLog)(current)}\n`);
      }
      current = initial;
    },
  });
};
