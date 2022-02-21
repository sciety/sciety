import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { List } from './list';
import { DomainEvent } from '../../domain-events';
import { isArticleAddedToListEvent } from '../../domain-events/article-added-to-list-event';
import * as DE from '../../types/data-error';
import * as Gid from '../../types/group-id';
import { ListId } from '../../types/list-id';

type GetList = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => TE.TaskEither<DE.DataError, List>;

const updateLastUpdatedFromEvents = (events: ReadonlyArray<DomainEvent>, listId: ListId) => (list: List) => pipe(
  events,
  RA.filter(isArticleAddedToListEvent),
  RA.filter((event) => event.listId === listId),
  RA.last,
  O.fold(
    () => list,
    (event) => ({ ...list, lastUpdated: O.some(event.date) }),
  ),
);

export const getList: GetList = (listId) => (events) => pipe(
  {
    'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7': {
      name: 'High interest articles',
      description: 'Articles that have been identified as high interest by NCRC editors.',
      lastUpdated: O.some(new Date('2021-11-24')),
      ownerId: Gid.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a'),
      articleCount: 0,
    },
    '5ac3a439-e5c6-4b15-b109-92928a740812': {
      name: 'Endorsed articles',
      description: 'Articles that have been endorsed by Biophysics Colab.',
      lastUpdated: O.some(new Date('2021-11-22T15:09:00Z')),
      ownerId: Gid.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
      articleCount: 0,
    },
    'c7237468-aac1-4132-9598-06e9ed68f31d': {
      name: 'Medicine',
      description: 'Medicine articles that have been evaluated by eLife.',
      lastUpdated: O.some(new Date('2022-02-17 00:00:00Z')),
      ownerId: Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
      articleCount: 0,
    },
    'cb15ef21-944d-44d6-b415-a3d8951e9e8b': {
      name: 'Cell Biology',
      description: 'Cell Biology articles that have been evaluated by eLife.',
      lastUpdated: O.some(new Date('2022-02-20 00:00:00Z')),
      ownerId: Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
      articleCount: 0,
    },
  },
  R.lookup(listId),
  TE.fromOption(() => DE.notFound),
  TE.map(updateLastUpdatedFromEvents(events, listId)),
);
