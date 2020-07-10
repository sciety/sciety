import { Logger } from '../src/infrastructure/logger';

const dummyLogger: Logger = () => {};

export default Object.assign(dummyLogger, { bindToRequestId: () => dummyLogger });
