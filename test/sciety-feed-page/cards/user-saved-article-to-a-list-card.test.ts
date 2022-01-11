import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { userSavedArticle } from '../../../src/domain-events';
import { userSavedArticleToAListCard } from '../../../src/sciety-feed-page/cards';
import { ScietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import * as DE from '../../../src/types/data-error';
import { arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-saved-article-to-a-list-card', () => {
  const userId = arbitraryUserId();
  const date = new Date('2021-09-15');
  const event = userSavedArticle(userId, arbitraryDoi(), date);

  describe('when user details are available', () => {
    const avatarUrl = arbitraryUri();
    const handle = 'handle';
    const ports = {
      getUserDetails: () => TE.right({
        handle,
        avatarUrl,
      }),
    };

    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      viewModel = await pipe(
        event,
        userSavedArticleToAListCard(ports),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('includes the user\'s handle in the title text', async () => {
      expect(viewModel.titleText).toContain(handle);
    });

    it('includes the user\'s avatar', async () => {
      expect(viewModel.avatarUrl).toStrictEqual(avatarUrl);
    });

    it('includes the event date', async () => {
      expect(viewModel.date).toStrictEqual(date);
    });

    it('includes the link to the list page', async () => {
      expect(viewModel.linkUrl).toBe(`/users/${handle}/lists/saved-articles`);
    });
  });

  describe('when user details are unavailable', () => {
    const failingGetUserDetails = () => TE.left(DE.unavailable);

    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      viewModel = await pipe(
        event,
        userSavedArticleToAListCard({ getUserDetails: failingGetUserDetails }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('replaces handle with "a user"', async () => {
      expect(viewModel.titleText).toMatch(/^A user/);
    });

    it('replaces avatar with a default image', async () => {
      expect(viewModel.avatarUrl).toBe('/static/images/sciety-logo.jpg');
    });

    it('links to the list page', async () => {
      expect(viewModel.linkUrl).toBe(`/users/${userId}/lists/saved-articles`);
    });
  });
});
