import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { userFollowedEditorialCommunity } from '../../../src/domain-events';
import { userFollowedAGroupCard } from '../../../src/sciety-feed-page/cards';
import { arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-followed-a-group-card', () => {
  const userId = arbitraryUserId();
  const avatarUrl = arbitraryUri();
  const handle = 'handle';
  const getUserDetails = () => TE.right({
    handle,
    avatarUrl,
  });
  const group = arbitraryGroup();
  const getGroup = () => TO.some(group);
  const event = userFollowedEditorialCommunity(userId, arbitraryGroupId(), new Date('2021-08-12'));

  it('displays the user\'s avatar', async () => {
    const result = await pipe(
      event,
      userFollowedAGroupCard(getUserDetails, getGroup),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(avatarUrl);
  });

  it('displays the user\'s handle', async () => {
    const result = await pipe(
      event,
      userFollowedAGroupCard(getUserDetails, getGroup),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(handle);
  });

  it('displays the date of the event', async () => {
    const result = await pipe(
      event,
      userFollowedAGroupCard(getUserDetails, getGroup),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain('Aug 12, 2021');
  });

  it.skip('links to the group page about tab', async () => {
    const result = await pipe(
      event,
      userFollowedAGroupCard(getUserDetails, getGroup),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(`href="/groups/${group.slug}/about"`);
  });
});
