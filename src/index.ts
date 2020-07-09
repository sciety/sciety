import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import createInfrastructure from './infrastructure';
import { createDebugLogger, createRTracerLogger } from './logger';
import createRouter from './router';
import createServer from './server';

const logger = createRTracerLogger(createDebugLogger());

logger('debug', 'Starting server');

const adapters = createInfrastructure(logger);

const router = createRouter(adapters);

const server = createServer(
  router,
  logger,
);

const terminusOptions: TerminusOptions = {
  onShutdown: async (): Promise<void> => {
    logger('debug', 'Shutting server down');
  },
  onSignal: async (): Promise<void> => {
    logger('debug', 'Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
};

createTerminus(server, terminusOptions);

server.listen(80);
