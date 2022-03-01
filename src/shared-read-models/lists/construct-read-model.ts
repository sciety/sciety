import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { List } from './list';
import { DomainEvent } from '../../domain-events';
import { ListId } from '../../types/list-id';

type ReadModel = Map<ListId, List>;

export const constructReadModel = (
  events: ReadonlyArray<DomainEvent>,
): ReadModel => pipe(
  events,
  RA.reduce(
    new Map<ListId, List>(),
    (state, event) => {
      switch (event.type) {
        case 'ListCreated':
          return state.set(event.listId, {
            name: event.name,
            description: event.description,
            ownerId: event.ownerId,
            articleCount: 0,
            lastUpdated: event.date,
          });
        case 'ArticleAddedToList':
          // eslint-disable-next-line no-case-declarations
          const existing: List = pipe(
            state.get(event.listId),
            O.fromNullable,
            O.getOrElseW(() => { throw new Error(`Can't find list with following listId in the read model: ${event.listId}`); }),
          );
          return state.set(event.listId, {
            ...existing,
            articleCount: existing.articleCount + 1,
            lastUpdated: event.date,
          });
        default:
          return state;
      }
    },
  ),
);
