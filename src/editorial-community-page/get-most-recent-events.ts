import { GetEvents } from './render-feed';
import { DomainEvent, isEditorialCommunityEndorsedArticleEvent } from '../types/domain-events';

type FilterFunction = (event: DomainEvent) => boolean;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<DomainEvent>>;

export default (filterEvents: FilterEvents, maxCount: number): GetEvents => (
  async (editorialCommunityId) => (
    filterEvents(
      (event) => (
        (isEditorialCommunityEndorsedArticleEvent(event)
          && event.editorialCommunityId.value === editorialCommunityId.value)
        || event.actorId.value === editorialCommunityId.value
      ),
      maxCount,
    )
  )
);
