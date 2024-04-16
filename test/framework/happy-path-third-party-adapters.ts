import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExternalQueries } from '../../src/third-parties';
import { ArticleId } from '../../src/types/article-id';
import { ArticleServer } from '../../src/types/article-server';
import * as DE from '../../src/types/data-error';
import { toHtmlFragment } from '../../src/types/html-fragment';
import * as PH from '../../src/types/publishing-history';
import { sanitise } from '../../src/types/sanitised-html-fragment';
import {
  arbitraryDate, arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryUri, arbitraryWord,
} from '../helpers';
import { arbitraryArticleServer } from '../types/article-server.helper';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';

export type HappyPathThirdPartyAdapters = ExternalQueries;

export const createHappyPathThirdPartyAdapters = (): HappyPathThirdPartyAdapters => ({
  fetchExpressionFrontMatter: (paperExpressionLocator) => TE.right({
    doi: new ArticleId(paperExpressionLocator),
    authors: O.none,
    title: sanitise(toHtmlFragment(arbitraryString())),
    abstract: O.some(sanitise(toHtmlFragment(arbitraryString()))),
    server: 'biorxiv' as ArticleServer,
  }),
  fetchRecommendedPapers: () => TE.right([
    arbitraryExpressionDoi(),
    arbitraryExpressionDoi(),
    arbitraryExpressionDoi(),
    arbitraryExpressionDoi(),
  ]),
  fetchEvaluation: () => TE.right({
    fullText: arbitrarySanitisedHtmlFragment(),
    url: new URL(arbitraryUri()),
  }),
  fetchStaticFile: () => TE.right('lorem ipsum'),
  fetchUserAvatarUrl: () => TE.right('/static/images/profile-dark.svg'),
  fetchPublishingHistory: (expressionDoi) => pipe(
    [
      {
        expressionType: 'preprint',
        expressionDoi,
        publisherHtmlUrl: new URL(arbitraryUri()),
        publishedAt: arbitraryDate(),
        publishedTo: arbitraryWord(),
        server: O.some(arbitraryArticleServer()),
      },
    ],
    PH.fromExpressions,
    E.mapLeft(() => DE.notFound),
    T.of,
  ),
  getArticleSubjectArea: () => TE.right({ value: arbitraryString(), server: arbitraryArticleServer() }),
  searchForPaperExpressions: () => () => TE.right({
    items: [],
    total: 0,
    nextCursor: O.none,
  }),
});
