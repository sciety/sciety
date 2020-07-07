import { AsyncLocalStorage } from 'async_hooks';
import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import { Maybe } from 'true-myth';
import createInfrastructure from './infrastructure';
import { createDebugLogger } from './logger';
import createRouter from './router';
import createServer from './server';

const asyncLocalStorage = new AsyncLocalStorage<string>();

const logger = createDebugLogger(() => Maybe.of(asyncLocalStorage.getStore()));

logger('debug', 'Starting server');

const adapters = createInfrastructure(logger);

const router = createRouter(adapters);

const server = createServer(router, logger, asyncLocalStorage);

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
