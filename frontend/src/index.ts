import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import debug from 'debug';
import createServer from './server';

const log = debug('http:server');

log('Starting server');

const server = createServer(log);

const terminusOptions: TerminusOptions = {
  onShutdown: async (): Promise<void> => {
    log('Server shutting down');
  },
  onSignal: async (): Promise<void> => {
    log('Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
};

createTerminus(server, terminusOptions);

server.listen(80, (): void => {
  log('Server running');
});



