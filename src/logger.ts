import debug, { Debugger } from 'debug';
import { Maybe } from 'true-myth';

type Level = 'debug' | 'info' | 'warn' | 'error';
type Payload = Record<string, unknown>;

export type Logger = (level: Level, message: string, payload?: Payload) => void;
export type BindableLogger = Logger & { bindToRequestId: () => Logger };

type GetRequestId = () => Maybe<string>;

export const createDebugLogger = (getRequestId: GetRequestId): BindableLogger => {
  const withDefaultPayload = (payload: Payload): Payload => (
    getRequestId().mapOr(
      payload,
      (requestId) => ({ requestId, ...payload }),
    )
  );

  const logger: Logger = (level, message, payload = {}) => {
    debug.log(new Date(), level, message, withDefaultPayload(payload));
  };
  const bindToRequestId: BindableLogger['bindToRequestId'] = () => {
    const defaultPayload = getRequestId().mapOr<Payload>(
      {},
      (requestId) => ({ requestId }),
    );
    return (level, message, payload = {}) => {
      debug.log(new Date(), level, message, { ...defaultPayload, ...payload });
    };
  };
  return Object.assign(logger, { bindToRequestId });
};

const log = debug('app');

export default (namespace?: string): Debugger => (namespace ? log.extend(namespace) : log);
