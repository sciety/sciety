import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import * as O from 'fp-ts/Option';
import { FetchArticle, FetchReview, FindVersionsForArticleDoi } from '../../src/shared-ports';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../helpers';
import { ArticleServer } from '../../src/types/article-server';

export type HappyPathThirdPartyAdapters = {
  fetchArticle: FetchArticle,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

export const createHappyPathThirdPartyAdapters = (): HappyPathThirdPartyAdapters => ({
  fetchArticle: (doi) => TE.right({
    doi,
    authors: O.none,
    title: sanitise(toHtmlFragment(arbitraryString())),
    abstract: sanitise(toHtmlFragment(arbitraryString())),
    server: 'biorxiv' as ArticleServer,
  }),
  fetchReview: () => TE.right({
    fullText: toHtmlFragment(arbitraryString()),
    url: new URL(arbitraryUri()),
  }),
  findVersionsForArticleDoi: () => TO.some([
    {
      source: new URL(arbitraryUri()),
      publishedAt: arbitraryDate(),
      version: 1,
    },
  ]),
});
