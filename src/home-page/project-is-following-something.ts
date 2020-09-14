import { IsFollowingSomething } from './render-feed';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getAllEvents: GetAllEvents): IsFollowingSomething => (
  async (userId) => {
    const result = new Set<string>();
    (await getAllEvents()).forEach((event) => {
      if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
        result.add(event.editorialCommunityId.value);
      } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
        result.delete(event.editorialCommunityId.value);
      }
    });
    return Array.from(result).map((id: string) => new EditorialCommunityId(id)).length > 0;
  }
);
