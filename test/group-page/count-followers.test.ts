import { pipe } from 'fp-ts/function';
import { countFollowersOf } from '../../src/group-page/count-followers';
import { userFollowedEditorialCommunity, userSavedArticle, userUnfollowedEditorialCommunity } from '../../src/types/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId, groupIdFromString } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

const myGroup = groupIdFromString('my-group');

const aUserId = arbitraryUserId();

describe('project-follower-count', () => {
  it('projects a count of followers based on follow events', async () => {
    expect(pipe(
      [
        userFollowedEditorialCommunity(arbitraryUserId(), myGroup),
        userFollowedEditorialCommunity(arbitraryUserId(), myGroup),
      ],
      countFollowersOf(groupIdFromString('my-group')),
    )).toBe(2);
  });

  it('ignores events from other communities', async () => {
    expect(pipe(
      [
        userFollowedEditorialCommunity(aUserId, arbitraryGroupId()),
      ],
      countFollowersOf(myGroup),
    )).toBe(0);
  });

  it('ignores other type of events', async () => {
    expect(pipe(
      [
        userSavedArticle(aUserId, arbitraryDoi()),
      ],
      countFollowersOf(groupIdFromString('my-group')),
    )).toBe(0);
  });

  it('removes followers based on unfollow events', async () => {
    expect(pipe(
      [
        userFollowedEditorialCommunity(aUserId, myGroup),
        userUnfollowedEditorialCommunity(aUserId, myGroup),
      ],
      countFollowersOf(groupIdFromString('my-group')),
    )).toBe(0);
  });
});
