import { Logger } from '../src/logger';

const dummyLogger: Logger = () => {};

export default Object.assign(dummyLogger, { bindToRequestId: () => dummyLogger });
