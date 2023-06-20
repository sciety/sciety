import { Logger } from '../src/shared-ports';

const loggerStub: Logger = () => {};

export const dummyLogger = Object.assign(loggerStub, { bindToRequestId: () => loggerStub });
