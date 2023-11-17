import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import * as O from 'fp-ts/Option';
import { SearchForArticles } from '../../src/shared-ports/search-for-articles.js';
import {
  FetchArticle, FetchRelatedArticles, FetchReview, FetchStaticFile, FindVersionsForArticleDoi, GetArticleSubjectArea,
} from '../../src/shared-ports/index.js';
import { sanitise } from '../../src/types/sanitised-html-fragment.js';
import { toHtmlFragment } from '../../src/types/html-fragment.js';
import {
  arbitraryDate, arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryUri,
} from '../helpers.js';
import { ArticleServer } from '../../src/types/article-server.js';
import { arbitraryArticleId } from '../types/article-id.helper.js';
import { arbitraryArticleServer } from '../types/article-server.helper.js';

export type HappyPathThirdPartyAdapters = {
  fetchArticle: FetchArticle,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  fetchStaticFile: FetchStaticFile,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getArticleSubjectArea: GetArticleSubjectArea,
  searchForArticles: SearchForArticles,
};

export const createHappyPathThirdPartyAdapters = (): HappyPathThirdPartyAdapters => ({
  fetchArticle: (doi) => TE.right({
    doi,
    authors: O.none,
    title: sanitise(toHtmlFragment(arbitraryString())),
    abstract: sanitise(toHtmlFragment(arbitraryString())),
    server: 'biorxiv' as ArticleServer,
  }),
  fetchRelatedArticles: () => TE.right([
    {
      articleId: arbitraryArticleId(),
      title: arbitrarySanitisedHtmlFragment(),
      authors: O.some([arbitraryString()]),
    },
  ]),
  fetchReview: () => TE.right({
    fullText: arbitrarySanitisedHtmlFragment(),
    url: new URL(arbitraryUri()),
  }),
  fetchStaticFile: () => TE.right('lorem ipsum'),
  findVersionsForArticleDoi: () => TO.some([
    {
      source: new URL(arbitraryUri()),
      publishedAt: arbitraryDate(),
      version: 1,
    },
  ]),
  getArticleSubjectArea: () => TE.right({ value: arbitraryString(), server: arbitraryArticleServer() }),
  searchForArticles: () => () => TE.right({
    items: [],
    total: 0,
    nextCursor: O.none,
  }),
});
