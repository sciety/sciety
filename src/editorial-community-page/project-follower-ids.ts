import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type ProjectFollowerIds = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<UserId>>;

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getAllEvents: GetAllEvents): ProjectFollowerIds => (
  async (editorialCommunityId) => {
    const userIds: Array<UserId> = [];

    (await getAllEvents()).forEach((event) => {
      if (event.type === 'UserFollowedEditorialCommunity') {
        if (event.editorialCommunityId.value === editorialCommunityId.value) {
          userIds.push(event.userId);
        }
      }
    });

    return userIds;
  }
);
