import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userSavedArticle } from '../../../src/types/domain-events';
import { Page } from '../../../src/types/page';
import { RenderPageError } from '../../../src/types/render-page-error';
import { savedArticlesPage } from '../../../src/user-page/saved-articles-page/saved-articles-page';
import {
  arbitrarySanitisedHtmlFragment,
  arbitraryString,
  arbitraryUri,
  arbitraryWord,
} from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const contentOf = (page: TE.TaskEither<RenderPageError, Page>) => pipe(
  page,
  TE.match(
    (errorPage) => errorPage.message,
    (p) => p.content,
  ),
);

describe('saved-articles-page', () => {
  it('shows the user details', async () => {
    const avatarUrl = arbitraryUri();
    const displayName = arbitraryString();
    const handle = arbitraryWord();
    const ports = {
      getUserDetails: () => TE.right({
        avatarUrl,
        displayName,
        handle,
      }),
      getAllEvents: T.of([]),
      fetchArticle: shouldNotBeCalled,
      findReviewsForArticleDoi: shouldNotBeCalled,
      findVersionsForArticleDoi: shouldNotBeCalled,
    };
    const params = { id: arbitraryUserId() };

    const pageHtml = await contentOf(savedArticlesPage(ports)(params))();

    expect(pageHtml).toContain(avatarUrl);
    expect(pageHtml).toContain(displayName);
    expect(pageHtml).toContain(handle);
  });

  it('shows articles as the active tab', async () => {
    const ports = {
      getUserDetails: () => TE.right({
        avatarUrl: arbitraryUri(),
        displayName: arbitraryString(),
        handle: arbitraryWord(),
      }),
      getAllEvents: T.of([]),
      fetchArticle: shouldNotBeCalled,
      findReviewsForArticleDoi: shouldNotBeCalled,
      findVersionsForArticleDoi: shouldNotBeCalled,
    };
    const params = { id: arbitraryUserId() };
    const page = await pipe(
      params,
      savedArticlesPage(ports),
      contentOf,
      T.map(JSDOM.fragment),
    )();
    const tabHeading = page.querySelector('.user-page-tab--heading')?.innerHTML;

    expect(tabHeading).toContain('Saved articles');
  });

  it.todo('shows the groups tab as the inactive tab');

  describe('when the user has saved articles', () => {
    it.todo('shows the count in the tab');

    it('shows the articles as a list of cards', async () => {
      const userId = arbitraryUserId();
      const ports = {
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
          handle: arbitraryWord(),
        }),
        getAllEvents: T.of([
          userSavedArticle(userId, arbitraryDoi()),
          userSavedArticle(userId, arbitraryDoi()),
        ]),
        fetchArticle: () => TE.right({
          doi: arbitraryDoi(),
          server: 'biorxiv' as const,
          title: arbitrarySanitisedHtmlFragment(),
          authors: [],
        }),
        findReviewsForArticleDoi: () => T.of([]),
        findVersionsForArticleDoi: () => TO.none,
      };
      const params = { id: userId };

      const page = await pipe(
        params,
        savedArticlesPage(ports),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const articleCards = page.querySelectorAll('.article-card');

      expect(articleCards).toHaveLength(2);
    });
  });

  describe('when the user has no saved articles', () => {
    it.todo('shows a count of 0 in the tab');

    it.todo('shows no list of article cards');

    it.todo('shows a message saying that the user has no saved articles');
  });
});
