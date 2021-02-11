import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { GetEvents } from './render-feed';
import {
  DomainEvent,
  EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { EditorialCommunityId, eqEditorialCommunityId } from '../types/editorial-community-id';

type FeedEvent =
  EditorialCommunityReviewedArticleEvent;

const wasCreatedBy = (editorialCommunityId: EditorialCommunityId) => (event: DomainEvent): event is FeedEvent => (
  (isEditorialCommunityReviewedArticleEvent(event)
    && eqEditorialCommunityId.equals(event.editorialCommunityId, editorialCommunityId))
);

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const createGetMostRecentEvents = (getAllEvents: GetAllEvents, maxCount: number): GetEvents => (
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
