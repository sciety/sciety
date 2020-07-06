import debug, { Debugger } from 'debug';

type Level = 'debug' | 'info' | 'warn' | 'error';

export type Logger = (level: Level, message: string, payload?: Record<string, unknown>) => void;

export const createDebugLogger = (): Logger => (
  (...args) => debug.log(new Date(), ...args)
);

const log = debug('app');

export default (namespace?: string): Debugger => (namespace ? log.extend(namespace) : log);
