import * as L from '../src/infrastructure/logger';

const loggerStub: L.Logger = () => {};

export const dummyLogger = Object.assign(loggerStub, { bindToRequestId: () => loggerStub });

export const dummyLoggerIO = L.loggerIO(dummyLogger);
