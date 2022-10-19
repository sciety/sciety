import { sequenceS } from 'fp-ts/Apply';
import * as D from 'fp-ts/Date';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { defaultCheckpoint } from './create-infrastructure';
import { GetListsEvents } from './get-lists-events';
import { ListsEvent } from './lists-event';
import { DomainEvent } from '../domain-events';
import { Logger } from '../shared-ports';
import { List } from '../shared-read-models/lists/list';
import { OwnedByQuery } from '../types/codecs/OwnedByQuery';
import * as DE from '../types/data-error';
import { ListId } from '../types/list-id';
import * as LOID from '../types/list-owner-id';
import { eqListOwnerId, ListOwnerId } from '../types/list-owner-id';

export type ReadModel = { contents: Map<ListId, List>, checkpoint: Date };

export const updateReadmodel = (state: ReadModel, event: DomainEvent): ReadModel => {
  switch (event.type) {
    case 'ListCreated':
      return {
        contents: state.contents.set(event.listId, {
          id: event.listId,
          name: event.name,
          description: event.description,
          ownerId: event.ownerId,
          articleCount: 0,
          lastUpdated: event.date,
        }),
        checkpoint: event.date,
      };
    case 'ArticleAddedToList':
      return {
        contents: pipe(
          state.contents.get(event.listId),
          O.fromNullable,
          O.getOrElseW(() => { throw new Error(`Can't find list with following listId in the read model: ${event.listId}`); }),
          (existing) => state.contents.set(event.listId, {
            ...existing,
            articleCount: existing.articleCount + 1,
            lastUpdated: event.date,
          }),
        ),
        checkpoint: event.date,
      };
    case 'ArticleRemovedFromList':
      return {
        contents: pipe(
          state.contents.get(event.listId),
          O.fromNullable,
          O.getOrElseW(() => { throw new Error(`Can't find list with following listId in the read model: ${event.listId}`); }),
          (existing) => state.contents.set(event.listId, {
            ...existing,
            articleCount: existing.articleCount - 1,
            lastUpdated: event.date,
          }),
        ),
        checkpoint: event.date,
      };
    default:
      return state;
  }
};

export const constructReadModel = (
  events: ReadonlyArray<DomainEvent>,
): ReadModel => pipe(
  events,
  RA.reduce(
    { contents: new Map<ListId, List>(), checkpoint: defaultCheckpoint() },
    updateReadmodel,
  ),
);

const orderByLastUpdatedDescending: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((list) => list.lastUpdated),
);

type SelectAllListsOwnedBy = (ownerId: ListOwnerId) => (readModel: ReadModel) => ReadonlyArray<List>;

export const selectAllListsOwnedBy: SelectAllListsOwnedBy = (ownerId) => flow(
  (readModel) => readModel.contents,
  RM.filter((list) => eqListOwnerId.equals(list.ownerId, ownerId)),
  RM.values(orderByLastUpdatedDescending),
);

type Ports = {
  getListsEvents: GetListsEvents,
  eventsAvailableAtStartup: ReadonlyArray<ListsEvent>,
  getNewListsEvents: (checkpoint: Date) => TE.TaskEither<DE.DataError, ReadonlyArray<ListsEvent>>,
  logger: Logger,
};

export const ownedBy = (ports: Ports): Middleware => {
  let statefulReadModel = constructReadModel(ports.eventsAvailableAtStartup);
  const latestReadModel = () => pipe(
    ports.getNewListsEvents(statefulReadModel.checkpoint),
    TE.map((newEvents) => pipe(
      newEvents,
      RA.reduce(
        statefulReadModel,
        updateReadmodel,
      ),
    )),
    TE.map((updatedReadModel) => {
      statefulReadModel = updatedReadModel;
      return updatedReadModel;
    }),
  );
  ports.logger('debug', 'Constructed read model at startup');
  return async ({ params, response }, next) => {
    ports.logger('debug', 'Started ownedBy query');
    await pipe(
      {
        readModel: latestReadModel(),
        ownerId: pipe(
          params.ownerId,
          LOID.fromStringCodec.decode,
          E.mapLeft(() => DE.unavailable),
          TE.fromEither,
        ),
      },
      sequenceS(TE.ApplyPar),
      TE.chainFirstTaskK(({ readModel }) => T.of(ports.logger('debug', 'Loaded new lists events and updated read model', { checkpoint: readModel.checkpoint }))),
      TE.map(({ readModel, ownerId }) => selectAllListsOwnedBy(ownerId)(readModel)),
      TE.chainFirstTaskK(() => T.of(ports.logger('debug', 'Queried read model'))),
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
};
