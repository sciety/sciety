import rTracer from 'cls-rtracer';
import { sequenceS } from 'fp-ts/Apply';
import * as D from 'fp-ts/Date';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { serializeError } from 'serialize-error';

enum Level {
  error,
  warn,
  info,
  debug,
}
type LevelName = keyof typeof Level;
export type Payload = Record<string, unknown>;

export type Logger = (level: LevelName, message: string, payload?: Payload, timestamp?: Date) => void;
export type LoggerIO = (entry: LogEntry) => IO.IO<void>;

export type LogEntry = { timestamp: Date, level: LevelName, message: string, payload?: Payload };

export const rTracerLogger = (logger: Logger): Logger => {
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

export const jsonSerializer = (prettyPrint = false): Serializer => (
  (entry) => (
    JSON.stringify(entry, replaceError, prettyPrint ? 2 : undefined)
  )
);

export const streamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
  logLevelName: string,
): Logger => {
  const configuredLevel = Level[logLevelName as LevelName] ?? Level.debug;
  return (level, message, payload = {}, date?) => {
    if (Level[level] > configuredLevel) {
      return;
    }
    const entry = {
      timestamp: date ?? new Date(),
      level,
      message,
      payload,
    };

    stream.write(`${serializer(entry)}\n`);
  };
};

export const loggerIO = (logger: Logger): LoggerIO => (
  (entry) => () => logger(entry.level, entry.message, entry.payload, entry.timestamp)
);

const logEntry = (level: LevelName) => (message: string) => (payload?: Payload): IO.IO<LogEntry> => pipe(
  {
    timestamp: D.create,
    level: pipe(level, IO.of),
    message: pipe(message, IO.of),
    payload: pipe(payload, IO.of),
  },
  sequenceS(IO.Apply),
);

export const error = logEntry('error');
export const info = logEntry('info');
export const warn = logEntry('warn');
export const debug = logEntry('debug');
