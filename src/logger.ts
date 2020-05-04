import debug, { Debugger } from 'debug';

const log = debug('app');

export default (namespace?: string): Debugger => (namespace ? log.extend(namespace) : log);
