import { Logger } from '../src/infrastructure-contract';
import * as L from '../src/infrastructure/logger';

const loggerStub: Logger = (process.env.TEST_DEBUG === 'true') ? (
  L.createLogger({
    logLevel: process.env.LOG_LEVEL ?? 'debug',
    prettyLog: !!process.env.PRETTY_LOG,
  })
) : () => {};

export const dummyLogger = Object.assign(loggerStub, { bindToRequestId: () => loggerStub });
