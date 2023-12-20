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
import { arbitraryArticleServer } from '../types/article-server.helper';
import { ExternalQueries } from '../../src/third-parties';
import { ArticleId } from '../../src/types/article-id';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';

export type HappyPathThirdPartyAdapters = ExternalQueries;

export const createHappyPathThirdPartyAdapters = (): HappyPathThirdPartyAdapters => ({
  fetchArticle: (doi) => TE.right({
    doi,
    authors: O.none,
    title: sanitise(toHtmlFragment(arbitraryString())),
    abstract: sanitise(toHtmlFragment(arbitraryString())),
    server: 'biorxiv' as ArticleServer,
  }),
  fetchPaperExpressionFrontMatter: (paperExpressionLocator) => TE.right({
    doi: new ArticleId(paperExpressionLocator),
    authors: O.none,
    title: sanitise(toHtmlFragment(arbitraryString())),
    abstract: sanitise(toHtmlFragment(arbitraryString())),
    server: 'biorxiv' as ArticleServer,
  }),
  fetchRelatedArticles: () => TE.right([arbitraryExpressionDoi()]),
  fetchReview: () => TE.right({
    fullText: arbitrarySanitisedHtmlFragment(),
    url: new URL(arbitraryUri()),
  }),
  fetchStaticFile: () => TE.right('lorem ipsum'),
  findAllExpressionsOfPaper: () => TO.some([
    {
      publisherHtmlUrl: new URL(arbitraryUri()),
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
