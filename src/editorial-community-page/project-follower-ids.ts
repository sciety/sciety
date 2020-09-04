import { UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { generate } from '../types/event-id';
import toUserId, { UserId } from '../types/user-id';

type ProjectFollowerIds = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<UserId>>;

const events: Array<UserFollowedEditorialCommunityEvent> = [
  {
    id: generate(),
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('47998559'),
    editorialCommunityId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  },
  {
    id: generate(),
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('23776533'),
    editorialCommunityId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  },
];

export default (): ProjectFollowerIds => (
  async (editorialCommunityId) => {
    const userIds: Array<UserId> = [];

    events.forEach((event) => {
      if (event.editorialCommunityId.value === editorialCommunityId.value) {
        userIds.push(event.userId);
      }
    });

    return userIds;
  }
);
