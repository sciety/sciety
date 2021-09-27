import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { userFollowedEditorialCommunity } from '../../../src/domain-events';
import { userFollowedAGroupCard } from '../../../src/sciety-feed-page/cards';
import { ScietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-followed-a-group-card', () => {
  const userId = arbitraryUserId();
  const date = arbitraryDate();
  const event = userFollowedEditorialCommunity(userId, arbitraryGroupId(), date);

  describe('happy path', () => {
    const avatarUrl = arbitraryUri();
    const handle = 'handle';
    const getUserDetails = () => TE.right({
      handle,
      avatarUrl,
    });
    const group = arbitraryGroup();
    const getGroup = () => TO.some(group);

    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      viewModel = await pipe(
        event,
        userFollowedAGroupCard(getUserDetails, getGroup),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays the user\'s avatar', async () => {
      expect(viewModel.avatarUrl).toStrictEqual(avatarUrl);
    });

    it('displays the user\'s handle in the title', async () => {
      expect(viewModel.titleText).toContain(handle);
    });

    it('displays the date of the event', async () => {
      expect(viewModel.date).toStrictEqual(date);
    });

    it.skip('links to the group page about tab', async () => {
      expect(viewModel.linkUrl).toStrictEqual(`/groups/${group.slug}/about`);
    });
  });

  describe('when the user details cannot be obtained', () => {
    it.todo('replaces handle with "a user"');

    it.todo('replaces avatar with a default image');

    it.todo('links to the group page about tab');
  });

  describe('when the group cannot be found', () => {
    it.todo('fails the card');
  });
});
