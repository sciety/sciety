import { createTerminus, TerminusOptions } from '@godaddy/terminus';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { createRouter } from './http/router';
import { createApplicationServer } from './http/server';
import { createInfrastructure } from './infrastructure';
import { Logger } from './infrastructure/logger';

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
  TE.Do,
  TE.apS('adapters', createInfrastructure({
    crossrefApiBearerToken: O.fromNullable(process.env.CROSSREF_API_BEARER_TOKEN),
    logLevel: process.env.LOG_LEVEL ?? 'debug',
    prettyLog: !!process.env.PRETTY_LOG,
    twitterApiBearerToken: process.env.TWITTER_API_BEARER_TOKEN ?? '',
  })),
  TE.bindW('router', ({ adapters }) => pipe(adapters, createRouter, TE.right)),
  TE.chainEitherKW(({ adapters, router }) => pipe(
    createApplicationServer(router, adapters.logger),
    E.map(flow(
      (server) => createTerminus(server, terminusOptions(adapters.logger)),
      (server) => server.on('listening', () => adapters.logger('debug', 'Server running')),
    )),
  )),
  TE.match(
    (error) => pipe(process.stderr.write(`Unable to start:\n${JSON.stringify(error, null, 2)}\n`), process.exit(1)),
    (server) => server.listen(80),
  ),
)();
