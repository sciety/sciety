import { sequenceS } from 'fp-ts/Apply';
import * as D from 'fp-ts/Date';
import * as E from 'fp-ts/Either';
import * as Ord from 'fp-ts/Ord';
import * as RM from 'fp-ts/ReadonlyMap';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GetListsEvents } from './get-lists-events';
import { ListsEvent } from './lists-event';
import { Logger } from '../shared-ports';
import { List } from '../shared-read-models/lists';
import { constructReadModel } from '../shared-read-models/lists/construct-read-model';
import { OwnedByQuery } from '../types/codecs/OwnedByQuery';
import * as DE from '../types/data-error';
import * as LOID from '../types/list-owner-id';
import { eqListOwnerId, ListOwnerId } from '../types/list-owner-id';

const orderByLastUpdatedDescending: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((list) => list.lastUpdated),
);

type SelectAllListsOwnedBy = (ownerId: ListOwnerId) => (events: ReadonlyArray<ListsEvent>) => ReadonlyArray<List>;

export const selectAllListsOwnedBy: SelectAllListsOwnedBy = (ownerId) => flow(
  constructReadModel,
  RM.filter((list) => eqListOwnerId.equals(list.ownerId, ownerId)),
  RM.values(orderByLastUpdatedDescending),
);

type Ports = {
  getListsEvents: GetListsEvents,
  logger: Logger,
};

export const ownedBy = (ports: Ports): Middleware => async ({ params, response }, next) => {
  ports.logger('debug', 'Started ownedBy query');
  await pipe(
    {
      events: ports.getListsEvents,
      ownerId: pipe(
        params.ownerId,
        LOID.fromStringCodec.decode,
        E.mapLeft(() => DE.unavailable),
        TE.fromEither,
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.chainFirstTaskK(() => T.of(ports.logger('debug', 'Loaded lists events'))),
    TE.map(({ events, ownerId }) => selectAllListsOwnedBy(ownerId)(events)),
    TE.chainFirstTaskK(() => T.of(ports.logger('debug', 'Constructed and queried read model'))),
    TE.match(
      () => {
        response.status = StatusCodes.SERVICE_UNAVAILABLE;
      },
      (items) => {
        response.status = StatusCodes.OK;
        response.set({ 'Content-Type': 'application/json' });
        response.body = OwnedByQuery.encode({ items });
      },
    ),
  )();

  await next();
};
