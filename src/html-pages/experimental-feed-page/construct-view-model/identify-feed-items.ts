import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { collapseCloseListEvents } from './collapse-close-list-events';
import { FeedItem } from './feed-item';
import { DomainEvent, isEventOfType } from '../../../domain-events';
import { PageOfItems, paginate } from '../../../shared-components/paginate';
import * as DE from '../../../types/data-error';
import { Dependencies } from './dependencies';

const isFeedRelevantEvent = (event: DomainEvent) => (
  isEventOfType('ArticleAddedToList')(event)
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isActivityOnUserList = (dependencies: Dependencies) => (event: DomainEvent) => true;

type IdentifyFeedItems = (dependencies: Dependencies, pageSize: number, page: number)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, PageOfItems<FeedItem>>;

export const identifyFeedItems: IdentifyFeedItems = (dependencies, pageSize, page) => flow(
  RA.filter(isFeedRelevantEvent),
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
