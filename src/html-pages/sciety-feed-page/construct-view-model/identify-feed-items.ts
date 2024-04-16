import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import { collapseCloseListEvents } from './collapse-close-list-events';
import { FeedItem } from './feed-item';
import { DomainEvent, isEventOfType } from '../../../domain-events';
import * as DE from '../../../types/data-error';
import { PageOfItems, paginate } from '../../shared-components/pagination';

const isFeedRelevantEvent = (event: DomainEvent) => (
  isEventOfType('UserFollowedEditorialCommunity')(event)
    || isEventOfType('ArticleAddedToList')(event)
);

type IdentifyFeedItems = (pageSize: number, page: number)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, PageOfItems<FeedItem>>;

export const identifyFeedItems: IdentifyFeedItems = (pageSize, page) => flow(
  RA.filter(isFeedRelevantEvent),
  collapseCloseListEvents,
  RA.reverse,
  paginate(pageSize, page),
);
