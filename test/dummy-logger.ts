import * as L from '../src/infrastructure/logger';

const loggerStub: L.Logger = (process.env.TEST_DEBUG === 'true') ? (
  L.createLogger({
    minimumLogLevel: process.env.LOG_LEVEL ?? 'debug',
    prettyLog: !!process.env.PRETTY_LOG,
  })
) : () => {};

export const dummyLogger = Object.assign(loggerStub, { bindToRequestId: () => loggerStub });
