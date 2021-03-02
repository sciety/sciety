import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { GetEvents } from './render-feed';
import {
  DomainEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { eqGroupId, GroupId } from '../types/editorial-community-id';

type FeedEvent =
  EditorialCommunityReviewedArticleEvent;

const wasCreatedBy = (editorialCommunityId: GroupId) => (event: DomainEvent): event is FeedEvent => (
  (isEditorialCommunityReviewedArticleEvent(event)
    && eqGroupId.equals(event.editorialCommunityId, editorialCommunityId))
);

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const getMostRecentEvents = (getAllEvents: GetAllEvents, maxCount: number): GetEvents => (
  (editorialCommunityId) => pipe(
    getAllEvents,
    T.map(
      flow(
        A.reverse,
        A.filter(wasCreatedBy(editorialCommunityId)),
        A.takeLeft(maxCount),
      ),
    ),
  )
);
