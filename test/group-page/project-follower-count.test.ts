import * as T from 'fp-ts/Task';
import { projectFollowerCount } from '../../src/group-page/project-follower-count';
import { Doi } from '../../src/types/doi';
import { userFollowedEditorialCommunity, userSavedArticle, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';
import { toUserId } from '../../src/types/user-id';

const myGroup = new GroupId('my-group');

describe('project-follower-count', () => {
  it('projects a count of followers based on follow events', async () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(toUserId('47998559'), myGroup),
      userFollowedEditorialCommunity(toUserId('23776533'), myGroup),
    ]);

    expect(await projectFollowerCount(getAllEvents)(myGroup)()).toBe(2);
  });

  it('ignores events from other communities', async () => {
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(toUserId('23776533'), new GroupId('a-different-group')),
    ]);

    expect(await projectFollowerCount(getAllEvents)(myGroup)()).toBe(0);
  });

  it('ignores other type of events', async () => {
    const getAllEvents = T.of([
      userSavedArticle(toUserId('someone'), new Doi('10.1101/111111')),
    ]);

    expect(await projectFollowerCount(getAllEvents)(myGroup)()).toBe(0);
  });

  it('removes followers based on unfollow events', async () => {
    const aUserId = toUserId('12345678');
    const getAllEvents = T.of([
      userFollowedEditorialCommunity(aUserId, myGroup),
      userUnfollowedEditorialCommunity(aUserId, myGroup),
    ]);

    expect(await projectFollowerCount(getAllEvents)(myGroup)()).toBe(0);
  });
});
