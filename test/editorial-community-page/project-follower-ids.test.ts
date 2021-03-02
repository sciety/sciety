import * as T from 'fp-ts/Task';
import { projectFollowerIds } from '../../src/editorial-community-page/project-follower-ids';
import { Doi } from '../../src/types/doi';
import { userFollowedEditorialCommunity, userSavedArticle, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toUserId } from '../../src/types/user-id';

describe('project-follower-ids', () => {
  it('projects a list of follower ids based on follow events', async () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(toUserId('47998559'), new EditorialCommunityId('group-a')),
      userFollowedEditorialCommunity(toUserId('23776533'), new EditorialCommunityId('group-a')),
    ]);
    const followerIds = await projectFollowerIds(getAllEvents)(new EditorialCommunityId('group-a'))();

    expect(followerIds).toHaveLength(2);
  });

  it('ignores events from other communities', async () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(toUserId('23776533'), new EditorialCommunityId('something')),
    ]);
    const followerIds = await projectFollowerIds(getAllEvents)(new EditorialCommunityId('other'))();

    expect(followerIds).toHaveLength(0);
  });

  it('ignores other type of events', async () => {
    const getAllEvents = T.of([
      userSavedArticle(toUserId('someone'), new Doi('10.1101/111111')),
    ]);
    const followerIds = await projectFollowerIds(getAllEvents)(new EditorialCommunityId('something'))();

    expect(followerIds).toHaveLength(0);
  });

  it('removes follower ids based on unfollow events', async () => {
    const aUserId = toUserId('12345678');
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(aUserId, new EditorialCommunityId('group-a')),
      userUnfollowedEditorialCommunity(aUserId, new EditorialCommunityId('group-a')),
    ]);
    const followerIds = await projectFollowerIds(getAllEvents)(new EditorialCommunityId('group-a'))();

    expect(followerIds).toHaveLength(0);
  });
});
