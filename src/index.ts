import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import createInfrastructure from './infrastructure';
import createRouter from './router';
import createServer from './server';

const adapters = createInfrastructure();

const router = createRouter(adapters);

const server = createServer(
  router,
  adapters.logger,
);

const terminusOptions: TerminusOptions = {
  onShutdown: async (): Promise<void> => {
    adapters.logger('debug', 'Shutting server down');
  },
  onSignal: async (): Promise<void> => {
    adapters.logger('debug', 'Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
};

createTerminus(server, terminusOptions);

adapters.logger('debug', 'Starting server');

server.listen(80);
