import { GetFollowedEditorialCommunityIds } from './get-hardcoded-followed-editorial-communities';
import { UserFollowedEditorialCommunityEvent, UserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import userId from '../types/user-id';

const hardcodedEvents: Array<UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent> = [
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserUnfollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
  },
];

export default (): GetFollowedEditorialCommunityIds => (
  async () => {
    const result = new Set<string>();
    hardcodedEvents.forEach((event) => {
      if (event.type === 'UserFollowedEditorialCommunity') {
        result.add(event.editorialCommunityId.value);
      } else if (event.type === 'UserUnfollowedEditorialCommunity') {
        result.delete(event.editorialCommunityId.value);
      }
    });
    return Array.from(result).map((id: string) => new EditorialCommunityId(id));
  }
);
