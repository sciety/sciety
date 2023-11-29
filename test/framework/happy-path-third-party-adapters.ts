import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import * as O from 'fp-ts/Option';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import { toHtmlFragment } from '../../src/types/html-fragment';
import {
  arbitraryDate, arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryUri,
} from '../helpers';
import { ArticleServer } from '../../src/types/article-server';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryArticleServer } from '../types/article-server.helper';
import { ExternalQueries } from '../../src/third-parties';

export type HappyPathThirdPartyAdapters = ExternalQueries;

export const createHappyPathThirdPartyAdapters = (): HappyPathThirdPartyAdapters => ({
  fetchArticle: (doi) => TE.right({
    doi,
    authors: O.none,
    title: sanitise(toHtmlFragment(arbitraryString())),
    abstract: sanitise(toHtmlFragment(arbitraryString())),
    server: 'biorxiv' as ArticleServer,
  }),
  fetchPaperExpressionFrontMatter: (doi) => TE.right({
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
