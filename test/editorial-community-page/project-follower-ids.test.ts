import createProjectFollowerIds, { GetAllEvents } from '../../src/editorial-community-page/project-follower-ids';
import { UserFollowedEditorialCommunityEvent } from '../../src/types/domain-events';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import { generate } from '../../src/types/event-id';
import toUserId from '../../src/types/user-id';

describe('project-follower-ids', () => {
  it('projects a list of follower ids based on follow events', async () => {
    const events: ReadonlyArray<UserFollowedEditorialCommunityEvent> = [
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
    const getAllEvents: GetAllEvents = async () => events;
    const projectFollowerIds = createProjectFollowerIds(getAllEvents);
    const followerIds = await projectFollowerIds(new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'));

    expect(followerIds).toHaveLength(2);
  });

  it('ignores events from other communities', async () => {
    const events: ReadonlyArray<UserFollowedEditorialCommunityEvent> = [
      {
        id: generate(),
        type: 'UserFollowedEditorialCommunity',
        date: new Date(),
        userId: toUserId('23776533'),
        editorialCommunityId: new EditorialCommunityId('something'),
      },
    ];
    const getAllEvents: GetAllEvents = async () => events;
    const projectFollowerIds = createProjectFollowerIds(getAllEvents);
    const followerIds = await projectFollowerIds(new EditorialCommunityId('other'));

    expect(followerIds).toHaveLength(0);
  });
});
