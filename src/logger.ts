import { AsyncLocalStorage } from 'async_hooks';
import debug, { Debugger } from 'debug';

type Level = 'debug' | 'info' | 'warn' | 'error';
type Payload = Record<string, unknown>;

export type Logger = (level: Level, message: string, payload?: Payload) => void;

export const createDebugLogger = (asyncLocalStorage: AsyncLocalStorage<string>): Logger => (
  (level, message, payload = {}) => {
    const continuationLocalRequestId = asyncLocalStorage.getStore();
    const inferredPayload: Payload = {};
    if (continuationLocalRequestId !== undefined) {
      inferredPayload.requestId = continuationLocalRequestId;
    }
    debug.log(new Date(), level, message, { ...inferredPayload, ...payload });
  }
);

const log = debug('app');

export default (namespace?: string): Debugger => (namespace ? log.extend(namespace) : log);
