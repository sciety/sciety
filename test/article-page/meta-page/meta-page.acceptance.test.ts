import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { articleMetaPage } from '../../../src/article-page/meta-page/meta-page';
import { arbitrarySanitisedHtmlFragment } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';

describe('meta page acceptance criteria', () => {
  it('allows the full article and evaluations to be viewed side by side on desktop', async () => {
    const params = {
      doi: arbitraryDoi(),
      user: O.none,
    };
    const adapters = {
      fetchArticle: () => TE.right({
        title: arbitrarySanitisedHtmlFragment(),
        authors: [],
        server: 'biorxiv' as const,
        abstract: arbitrarySanitisedHtmlFragment(),
      }),
      getAllEvents: T.of([]),
    };
    const page = await pipe(
      articleMetaPage(params)(adapters),
      TE.getOrElse(() => { throw new Error('cannot happen'); }),
    )();

    const doc = JSDOM.fragment(page.content);

    const doiLink = doc.querySelector('.article-meta-data-list a');
    const readFullArticleLink = doc.querySelector('.full-article-button');

    const doiLinkTarget = doiLink?.getAttribute('target');
    const readFullArticleLinkTarget = readFullArticleLink?.getAttribute('target');

    expect(doiLinkTarget).toStrictEqual('_blank');
    expect(readFullArticleLinkTarget).toStrictEqual('_blank');
  });
});
