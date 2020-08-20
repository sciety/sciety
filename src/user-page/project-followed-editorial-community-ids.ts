import { GetFollowedEditorialCommunityIds } from './get-hardcoded-followed-editorial-communities';
import { UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import userId from '../types/user-id';

const hardcodedEvents: Array<UserFollowedEditorialCommunityEvent> = [
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
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
  },
];

export default (): GetFollowedEditorialCommunityIds => (
  async () => (
    hardcodedEvents.map((event) => event.editorialCommunityId)
  )
);
