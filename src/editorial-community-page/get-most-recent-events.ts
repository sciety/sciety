import { GetEvents } from './render-feed';
import { DomainEvent, isEditorialCommunityEndorsedArticleEvent } from '../types/domain-events';

type FilterFunction = (event: DomainEvent) => event is DomainEvent;
export type FilterEvents = (filterFunction: FilterFunction, maxCount: number) => Promise<Array<DomainEvent>>;

export default (filterEvents: FilterEvents, maxCount: number): GetEvents => (
  async (editorialCommunityId) => (
    filterEvents(
      (event): event is DomainEvent => (
        (isEditorialCommunityEndorsedArticleEvent(event)
          && event.editorialCommunityId.value === editorialCommunityId.value)
        || event.actorId.value === editorialCommunityId.value
      ),
      maxCount,
    )
  )
);
