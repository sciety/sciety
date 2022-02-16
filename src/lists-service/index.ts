import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import {
  createInfrastructure,
} from './create-infrastructure';
import { createRouter } from './router';
import { createApplicationServer } from './server';
import { Logger, replaceError } from '../infrastructure/logger';

const terminusOptions = (logger: Logger): TerminusOptions => ({
  onShutdown: async () => {
    logger('debug', 'Shutting server down');
  },
  onSignal: async () => {
    logger('debug', 'Signal received');
  },
  signals: ['SIGINT', 'SIGTERM'],
});

void pipe(
  createInfrastructure({
    logLevel: process.env.LOG_LEVEL ?? 'debug',
    prettyLog: !!process.env.PRETTY_LOG,
  }),
  TE.map((adapters) => pipe(
    adapters,
    createRouter,
    (router) => ({ router, adapters }),
  )),
  TE.chainEitherKW(({ adapters, router }) => pipe(
    createApplicationServer(router, adapters),
    E.map(flow(
      (server) => createTerminus(server, terminusOptions(adapters.logger)),
      (server) => server.on('listening', () => adapters.logger('info', 'Server running')),
    )),
    E.map((server) => ({
      server,
      adapters,
    })),
  )),
  TE.match(
    (error) => {
      process.stderr.write(`Unable to start:\n${JSON.stringify(error, null, 2)}\n`);
      process.stderr.write(`Error object: ${JSON.stringify(error, replaceError, 2)}\n`);
      return process.exit(1);
    },
    ({ server, adapters }) => { server.listen(80); return adapters; },
  ),
)();
