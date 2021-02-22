import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { createRouter } from './http/router';
import { createApplicationServer } from './http/server';
import { createInfrastructure } from './infrastructure';
import { Logger } from './infrastructure/logger';

const terminusOptions = (logger: Logger): TerminusOptions => ({
  onShutdown: async (): Promise<void> => {
    logger('debug', 'Shutting server down');
  },
  onSignal: async (): Promise<void> => {
    logger('debug', 'Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
});

void pipe(
  TE.Do,
  TE.bind('adapters', createInfrastructure),
  TE.bindW('router', ({ adapters }) => pipe(adapters, createRouter, TE.right)),
  TE.chainW(({ adapters, router }) => pipe(
    E.tryCatch(() => createApplicationServer(router, adapters.logger), identity),
    E.map((server) => createTerminus(server, terminusOptions(adapters.logger))),
    E.map((server) => server.on('listening', () => adapters.logger('debug', 'Server running'))),
    TE.fromEither,
  )),
  T.map(E.fold(
    (error) => pipe(process.stderr.write(`Unable to start:\n${String(error)}\n`), process.exit(1)),
    (server) => server.listen(80),
  )),
)();
