import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { collapseCloseListEvents } from './collapse-close-list-events';
import { FeedItem } from './feed-item';
import {
  DomainEvent,
  isArticleAddedToListEvent, isUserFollowedEditorialCommunityEvent,
} from '../../../domain-events';
import { PageOfItems, paginate } from '../../../shared-components/paginate';
import * as DE from '../../../types/data-error';

const isFeedRelevantEvent = (event: DomainEvent) => (
  isUserFollowedEditorialCommunityEvent(event)
    || isArticleAddedToListEvent(event)
);

type IdentifyFeedItems = (pageSize: number, page: number)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, PageOfItems<FeedItem>>;

export const identifyFeedItems: IdentifyFeedItems = (pageSize, page) => flow(
  RA.filter(isFeedRelevantEvent),
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
