import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RM from 'fp-ts/ReadonlyMap';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GetListsEvents } from './get-lists-events';
import { Logger } from '../infrastructure/logger';
import { List } from '../shared-read-models/lists';
import { constructReadModel } from '../shared-read-models/lists/construct-read-model';

type Ports = {
  getListsEvents: GetListsEvents,
  logger: Logger,
};

const orderByLastUpdatedDescending: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((list) => list.lastUpdated),
);

export const ownedBy = (ports: Ports): Middleware => async ({ params, response }, next) => {
  response.set({ 'Content-Type': 'application/json' });
  ports.logger('debug', 'Started ownedBy query');
  await pipe(
    ports.getListsEvents,
    TE.chainFirst(() => {
      ports.logger('debug', 'Loaded lists events');
      return TE.right('everything is ok');
    }),
    TE.map(constructReadModel),
    TE.chainFirst(() => {
      ports.logger('debug', 'Constructed read model');
      return TE.right('everything is ok');
    }),
    TE.map(RM.filter((list) => list.ownerId === params.groupId)),
    TE.map(RM.values(orderByLastUpdatedDescending)),
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
