import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { userSavedArticle } from '../../../src/domain-events';
import { userSavedArticleToAListCard } from '../../../src/sciety-feed-page/cards';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-saved-article-to-a-list-card', () => {
  const getUserDetails = () => TE.right({ handle: 'handle' });
  const date = new Date('2021-09-15');
  const event = userSavedArticle(arbitraryUserId(), arbitraryDoi(), date);

  it('includes the user\'s handle', async () => {
    const result = await pipe(
      event,
      userSavedArticleToAListCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain('handle');
  });

  it.todo('includes the user\'s avatar');

  it('includes the event date', async () => {
    const result = await pipe(
      event,
      userSavedArticleToAListCard(getUserDetails),
      TE.getOrElseW(shouldNotBeCalled),
    )();

    expect(result).toContain('Sep 15, 2021');
  });

  it.todo('includes the link to the list page');

  it.todo('includes title and description of the list');
});
