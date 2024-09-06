import { createLogger } from './create-logger';
import { defaultLogLevel } from '../../logger/log-level';

export const logCatastrophicFailure = (error: unknown): void => {
  const logger = createLogger({
    logLevel: defaultLogLevel,
    prettyLog: !!process.env.PRETTY_LOG,
  });
  logger('error', 'Unable to start', { error });
};
