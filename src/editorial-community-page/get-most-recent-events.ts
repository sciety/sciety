import * as A from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { GetEvents } from './render-feed';
import {
  DomainEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';

type FeedEvent =
  EditorialCommunityReviewedArticleEvent;

const wasCreatedBy = (editorialCommunityId: EditorialCommunityId) => (event: DomainEvent): event is FeedEvent => (
  (isEditorialCommunityReviewedArticleEvent(event)
    && event.editorialCommunityId.value === editorialCommunityId.value)
);

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export default (getAllEvents: GetAllEvents, maxCount: number): GetEvents => (
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
