import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { collapseCloseListEvents } from './collapse-close-list-events';
import { FeedItem } from './feed-item';
import { DomainEvent, EventOfType, isEventOfType } from '../../../domain-events';
import { PageOfItems, paginate } from '../../../shared-components/paginate';
import * as DE from '../../../types/data-error';
import { Dependencies } from './dependencies';

const isActivityOnUserList = (dependencies: Dependencies) => (event: EventOfType<'ArticleAddedToList'>) => pipe(
  event.listId,
  dependencies.lookupList,
  O.match(
    () => false,
    () => true,
  ),
);

type IdentifyFeedItems = (dependencies: Dependencies, pageSize: number, page: number)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, PageOfItems<FeedItem>>;

export const identifyFeedItems: IdentifyFeedItems = (dependencies, pageSize, page) => flow(
  RA.filter(isEventOfType('ArticleAddedToList')),
  RA.filter(isActivityOnUserList(dependencies)),
  RA.match(
    () => E.right({
      items: [],
      nextPage: O.none,
      pageNumber: 1,
      numberOfPages: 1,
      numberOfOriginalItems: 0,
    }),
    flow(
      collapseCloseListEvents,
      RA.reverse,
      paginate(pageSize, page),
    ),
  ),
);
