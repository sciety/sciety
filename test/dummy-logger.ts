import { Logger } from '../src/infrastructure/logger';

const loggerStub: Logger = () => {};

export const dummyLogger = Object.assign(loggerStub, { bindToRequestId: () => loggerStub });
