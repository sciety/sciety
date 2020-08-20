import { GetFollowedEditorialCommunityIds } from './get-hardcoded-followed-editorial-communities';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import toUserId from '../types/user-id';

const hardcodedEvents: Array<DomainEvent> = [
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('someone'),
    editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserUnfollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('someone'),
    editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date(),
    actorId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('someoneelse'),
    editorialCommunityId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  },
  {
    type: 'UserUnfollowedEditorialCommunity',
    date: new Date(),
    userId: toUserId('someoneelse'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
];

export default (): GetFollowedEditorialCommunityIds => (
  async (userId) => {
    const result = new Set<string>();
    hardcodedEvents.forEach((event) => {
      if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
        result.add(event.editorialCommunityId.value);
      } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
        result.delete(event.editorialCommunityId.value);
      }
    });
    return Array.from(result).map((id: string) => new EditorialCommunityId(id));
  }
);
