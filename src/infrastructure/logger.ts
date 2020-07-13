import rTracer from 'cls-rtracer';
import { Maybe } from 'true-myth';

type Level = 'debug' | 'info' | 'warn' | 'error';
type Payload = Record<string, unknown>;

export type Logger = (level: Level, message: string, payload?: Payload) => void;

export const createRTracerLogger = (logger: Logger): Logger => {
  const withRequestId = (payload: Payload): Payload => (
    Maybe.of(rTracer.id()).mapOr(
      payload,
      (requestId) => ({ ...payload, requestId }),
    )
  );

  return (level, message, payload = {}) => (
    logger(level, message, withRequestId(payload))
  );
};

type Entry = {
  timestamp: Date,
  level: Level,
  message: string,
  payload: Payload,
};

type Serializer = (entry: Entry) => string;

export const createJsonSerializer = (prettyPrint = false): Serializer => (
  (entry) => (
    JSON.stringify(entry, undefined, prettyPrint ? 2 : undefined)
  )
);

export const createStreamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
): Logger => (
  (level, message, payload = {}) => {
    const entry = {
      timestamp: new Date(),
      level,
      message,
      payload,
    };

    stream.write(`${serializer(entry)}\n`);
  }
);
