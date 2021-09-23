import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { userSavedArticle } from '../../../src/domain-events';
import { userSavedArticleToAListCard } from '../../../src/sciety-feed-page/cards';
import * as DE from '../../../src/types/data-error';
import { arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-saved-article-to-a-list-card', () => {
  const avatarUrl = arbitraryUri();
  const handle = 'handle';
  const getUserDetails = () => TE.right({
    handle,
    avatarUrl,
  });
  const date = new Date('2021-09-15');
  const event = userSavedArticle(arbitraryUserId(), arbitraryDoi(), date);

  it('includes the user\'s handle', async () => {
    const result = await pipe(
      event,
      userSavedArticleToAListCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(handle);
  });

  it('includes the user\'s avatar', async () => {
    const result = await pipe(
      event,
      userSavedArticleToAListCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(avatarUrl);
  });

  it('includes the event date', async () => {
    const result = await pipe(
      event,
      userSavedArticleToAListCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain('Sep 15, 2021');
  });

  it('includes the link to the list page', async () => {
    const result = await pipe(
      event,
      userSavedArticleToAListCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain(`href="/users/${handle}/lists/saved-articles"`);
  });

  it.todo('includes title and description of the list');

  describe('when user details are unavailable', () => {
    const failingGetUserDetails = () => TE.left(DE.unavailable);

    it.skip('returns a card', async () => {
      const result = await pipe(
        event,
        userSavedArticleToAListCard(failingGetUserDetails),
        TE.getOrElseW(shouldNotBeCalled),
      )();

      expect(result).toContain('sciety-feed-card');
    });

    it.skip('replaces handle with "a user"', async () => {
      const result = await pipe(
        event,
        userSavedArticleToAListCard(failingGetUserDetails),
        TE.getOrElseW(shouldNotBeCalled),
      )();

      expect(result).toContain('A user saved an article');
    });

    it.skip('replaces avatar with a default image', async () => {
      const result = await pipe(
        event,
        userSavedArticleToAListCard(failingGetUserDetails),
        TE.getOrElseW(shouldNotBeCalled),
      )();

      expect(result).toContain('src="/static/images/sciety-logo.jpg"');
    });

    it.todo('links to the correct place');
  });
});
