import debug, { Debugger } from 'debug';
import { Maybe } from 'true-myth';

type Level = 'debug' | 'info' | 'warn' | 'error';
type Payload = Record<string, unknown>;

export type Logger = (level: Level, message: string, payload?: Payload) => void;

type GetRequestId = () => Maybe<string>;

export const createDebugLogger = (getRequestId: GetRequestId): Logger => {
  const withDefaultPayload = (payload: Payload): Payload => (
    getRequestId().mapOr(
      payload,
      (requestId) => ({ requestId, ...payload }),
    )
  );

  return (level, message, payload = {}) => {
    debug.log(new Date(), level, message, withDefaultPayload(payload));
  };
};

const log = debug('app');

export default (namespace?: string): Debugger => (namespace ? log.extend(namespace) : log);
