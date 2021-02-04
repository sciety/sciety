import rTracer from 'cls-rtracer';
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

export type Logger = (level: LevelName, message: string, payload?: Payload) => void;

export const createRTracerLogger = (logger: Logger): Logger => {
  const withRequestId = (payload: Payload): Payload => pipe(
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

const replaceError = (_key: string, value: unknown): unknown => {
  if (_key === 'Authorization' || _key === 'Crossref-Plus-API-Token') {
    return '--redacted--';
  }
  if (value instanceof Error) {
    return serializeError(value);
  }
  return value;
};

export const createJsonSerializer = (prettyPrint = false): Serializer => (
  (entry) => (
    JSON.stringify(entry, replaceError, prettyPrint ? 2 : undefined)
  )
);

const getConfiguredLevel = (): Level => {
  const name = process.env.LOG_LEVEL ?? 'debug';
  if (name in Level) {
    return Level[name as LevelName];
  }

  return Level.debug;
};

export const createStreamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
): Logger => {
  const configuredLevel = getConfiguredLevel();
  return (level, message, payload = {}) => {
    if (Level[level] > configuredLevel) {
      return;
    }
    const entry = {
      timestamp: new Date(),
      level,
      message,
      payload,
    };

    stream.write(`${serializer(entry)}\n`);
  };
};
