import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import createRouter from './http/router';
import createServer from './http/server';
import { createInfrastructure } from './infrastructure';

void (async (): Promise<void> => {
  const adapters = await createInfrastructure();

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

  server.on('listening', (): void => adapters.logger('debug', 'Server running'));

  server.listen(80);
})();
