import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GetListsEvents } from './get-lists-events';
import { selectAllListsOwnedBy } from './select-all-lists-owned-by';
import { Logger } from '../infrastructure/logger';

type Ports = {
  getListsEvents: GetListsEvents,
  logger: Logger,
};

export const ownedBy = (ports: Ports): Middleware => async ({ params, response }, next) => {
  response.set({ 'Content-Type': 'application/json' });
  ports.logger('debug', 'Started ownedBy query');
  await pipe(
    ports.getListsEvents,
    TE.chainFirst(() => {
      ports.logger('debug', 'Loaded lists events');
      return TE.right('everything is ok');
    }),
    TE.map(selectAllListsOwnedBy(params.groupId)),
    TE.chainFirst(() => {
      ports.logger('debug', 'Constructed and queried read model');
      return TE.right('everything is ok');
    }),
    TE.match(
      () => {
        response.status = StatusCodes.SERVICE_UNAVAILABLE;
      },
      (items) => {
        response.status = StatusCodes.OK;
        response.body = { items };
      },
    ),
  )();

  await next();
};
