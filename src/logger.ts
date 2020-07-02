import debug, { Debugger } from 'debug';

type Level = 'debug' | 'warn' | 'error';

export type Logger = (level: Level, message: string) => void;

export const createDebugLogger = (): Logger => (
  (level, message) => debug.log(new Date(), level, message)
);

const log = debug('app');

export default (namespace?: string): Debugger => (namespace ? log.extend(namespace) : log);
