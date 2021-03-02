import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { GetEvents } from './render-feed';
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

export const getMostRecentEvents = (getAllEvents: GetAllEvents, maxCount: number): GetEvents => (
  (groupId) => pipe(
    getAllEvents,
    T.map(
      flow(
        A.reverse,
        A.filter(wasCreatedBy(groupId)),
        A.takeLeft(maxCount),
      ),
    ),
  )
);
