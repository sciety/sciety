import * as L from '../src/infrastructure/logger.js';

const loggerStub: L.Logger = (process.env.TEST_DEBUG === 'true') ? (
  L.createLogger({
    logLevel: process.env.LOG_LEVEL ?? 'debug',
    prettyLog: !!process.env.PRETTY_LOG,
  })
) : () => {};

export const dummyLogger = Object.assign(loggerStub, { bindToRequestId: () => loggerStub });
