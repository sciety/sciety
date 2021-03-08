import { pipe } from 'fp-ts/function';
import { countFollowersOf } from '../../src/group-page/count-followers';
import { Doi } from '../../src/types/doi';
import { userFollowedEditorialCommunity, userSavedArticle, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { GroupId } from '../../src/types/group-id';
import { toUserId } from '../../src/types/user-id';

const myGroup = new GroupId('my-group');

const aUserId = toUserId('12345678');

describe('project-follower-count', () => {
  it('projects a count of followers based on follow events', async () => {
    expect(pipe(
      [
        userFollowedEditorialCommunity(toUserId('47998559'), myGroup),
        userFollowedEditorialCommunity(toUserId('23776533'), myGroup),
      ],
      countFollowersOf(new GroupId('my-group')),
    )).toBe(2);
  });

  it('ignores events from other communities', async () => {
    expect(pipe(
      [
        userFollowedEditorialCommunity(aUserId, new GroupId('a-different-group')),
      ],
      countFollowersOf(myGroup),
    )).toBe(0);
  });

  it('ignores other type of events', async () => {
    expect(pipe(
      [
        userSavedArticle(aUserId, new Doi('10.1101/111111')),
      ],
      countFollowersOf(new GroupId('my-group')),
    )).toBe(0);
  });

  it('removes followers based on unfollow events', async () => {
    expect(pipe(
      [
        userFollowedEditorialCommunity(aUserId, myGroup),
        userUnfollowedEditorialCommunity(aUserId, myGroup),
      ],
      countFollowersOf(new GroupId('my-group')),
    )).toBe(0);
  });
});
