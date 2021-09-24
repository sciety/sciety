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
  const event = userFollowedEditorialCommunity(userId, arbitraryGroupId());

  it.todo('displays the user\'s avatar');

  it.skip('displays the user\'s handle', async () => {
    const result = await pipe(
      event,
      userFollowedAGroupCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(handle);
  });

  it.todo('displays the date of the event');

  it.todo('links to the group page about tab');
});
