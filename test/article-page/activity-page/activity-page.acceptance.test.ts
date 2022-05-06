import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { articleActivityPage } from '../../../src/article-page/activity-page/activity-page';
import { arbitraryHtmlFragment, arbitrarySanitisedHtmlFragment, arbitraryUri } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';

describe('activity page acceptance criteria', () => {
  describe('when the user navigates to the full article', () => {
    it('allows the full article and evaluations to be viewed side by side on desktop by opening link in new tab', async () => {
      const params = {
        doi: arbitraryDoi(),
        user: O.none,
      };
      const adapters = {
        fetchArticle: () => TE.right({
          title: arbitrarySanitisedHtmlFragment(),
          authors: O.none,
          server: 'biorxiv' as const,
          abstract: arbitrarySanitisedHtmlFragment(),
        }),
        getAllEvents: T.of([]),
        fetchReview: () => TE.right({
          fullText: arbitraryHtmlFragment(),
          url: new URL(arbitraryUri()),
        }),
        findVersionsForArticleDoi: () => TO.none,
      };
      const page = await pipe(
        articleActivityPage(adapters)(params),
        TE.getOrElse(() => { throw new Error('cannot happen'); }),
      )();

      const doc = JSDOM.fragment(page.content);

      const doiLink = doc.querySelector('.article-meta-data-list a');
      const readFullArticleLink = doc.querySelector('.full-article-button');

      const doiLinkTarget = doiLink?.getAttribute('target');
      const readFullArticleLinkTarget = readFullArticleLink?.getAttribute('target');

      expect(doiLinkTarget).toBe('_blank');
      expect(readFullArticleLinkTarget).toBe('_blank');
    });
  });
});
