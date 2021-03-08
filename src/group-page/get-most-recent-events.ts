import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import {
  DomainEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { eqGroupId, GroupId } from '../types/group-id';

type FeedEvent =
  EditorialCommunityReviewedArticleEvent;

const wasCreatedBy = (groupId: GroupId) => (event: DomainEvent): event is FeedEvent => (
  (isEditorialCommunityReviewedArticleEvent(event)
    && eqGroupId.equals(event.editorialCommunityId, groupId))
);

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type SelectFeedEvents = (groupId: GroupId, maxCount: number)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<FeedEvent>;

export const getMostRecentEvents: SelectFeedEvents = (groupId, maxCount) => flow(
  A.reverse,
  A.filter(wasCreatedBy(groupId)),
  A.takeLeft(maxCount),
);
