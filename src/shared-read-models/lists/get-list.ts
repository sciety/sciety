import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { constructReadModel } from './construct-read-model';
import { List } from './list';
import { DomainEvent } from '../../domain-events';
import { isArticleAddedToListEvent } from '../../domain-events/article-added-to-list-event';
import * as DE from '../../types/data-error';
import * as Gid from '../../types/group-id';
import { ListId } from '../../types/list-id';

type GetList = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => TE.TaskEither<DE.DataError, List>;

type HardcodedList = {
  id: ListId,
  name: string,
  description: string,
  articleCount: number,
  createdOn: Date,
  ownerId: Gid.GroupId,
};

const addLastUpdatedFromEvents = (
  events: ReadonlyArray<DomainEvent>, listId: ListId,
) => (list: HardcodedList): List => pipe(
  events,
  RA.filter(isArticleAddedToListEvent),
  RA.filter((event) => event.listId === listId),
  RA.last,
  O.fold(
    () => ({ ...list, lastUpdated: list.createdOn }),
    (event) => ({ ...list, lastUpdated: event.date }),
  ),
);

const listFromEvents = (
  events: ReadonlyArray<DomainEvent>,
  listId: ListId,
) => (): TE.TaskEither<DE.DataError, List> => pipe(
  events,
  constructReadModel,
  RM.lookup(S.Eq)(listId),
  TE.fromOption(() => DE.notFound),
);

export const getList: GetList = (listId) => (events) => pipe(
  O.none,
  TE.fromOption(() => DE.notFound),
  TE.map(addLastUpdatedFromEvents(events, listId)),
  TE.alt(listFromEvents(events, listId)),
);
