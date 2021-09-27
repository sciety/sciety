import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { userFollowedEditorialCommunity } from '../../../src/domain-events';
import { userFollowedAGroupCard } from '../../../src/sciety-feed-page/cards';
import { arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-followed-a-group-card', () => {
  const userId = arbitraryUserId();
  const avatarUrl = arbitraryUri();
  const handle = 'handle';
  const getUserDetails = () => TE.right({
    handle,
    avatarUrl,
  });
  const event = userFollowedEditorialCommunity(userId, arbitraryGroupId(), new Date('2021-08-12'));

  it('displays the user\'s avatar', async () => {
    const result = await pipe(
      event,
      userFollowedAGroupCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(avatarUrl);
  });

  it('displays the user\'s handle', async () => {
    const result = await pipe(
      event,
      userFollowedAGroupCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(handle);
  });

  it('displays the date of the event', async () => {
    const result = await pipe(
      event,
      userFollowedAGroupCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain('Aug 12, 2021');
  });

  it.todo('links to the group page about tab');
});
