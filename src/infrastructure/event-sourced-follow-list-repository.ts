import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export type EventSourcedFollowListRepository = (userId: UserId) => Promise<FollowList>;

export default (getAllEvents: GetAllEvents): EventSourcedFollowListRepository => (
  async (userId) => {
    const result = new Set<string>();

    (await getAllEvents()).forEach((event) => {
      if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
        result.add(event.editorialCommunityId.value);
      } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
        result.delete(event.editorialCommunityId.value);
      }
    });

    const list = Array.from(result).map((id: string) => new EditorialCommunityId(id));

    return new FollowList(list);
  }
);
