import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { CurationStatementViewModel, constructCurationStatements } from '../curation-statements';
import { Doi } from '../../types/doi';
import { Queries } from '../../read-models';
import { ArticleErrorCardViewModel } from './render-article-error-card';
import { Ports as GetLatestArticleVersionDatePorts, getLatestArticleVersionDate } from './get-latest-article-version-date';
import { fetchArticleDetails } from './fetch-article-details';
import {
  FetchArticle, FetchRelatedArticles, FetchReview, FindVersionsForArticleDoi, Logger,
} from '../../shared-ports';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { CurationStatementTeaserViewModel, ArticleCardViewModel } from './render-article-card';

export type Dependencies = Queries
& GetLatestArticleVersionDatePorts
& {
  fetchArticle: FetchArticle,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  logger: Logger,
};

const getArticleDetails = (ports: Dependencies) => fetchArticleDetails(
  getLatestArticleVersionDate(ports),
  ports.fetchArticle,
);

const transformIntoCurationStatementViewModel = (
  curationStatement: CurationStatementViewModel,
): CurationStatementTeaserViewModel => ({
  groupPageHref: `/groups/${curationStatement.groupSlug}`,
  groupName: curationStatement.groupName,
  quote: sanitise(toHtmlFragment(curationStatement.statement)),
  quoteLanguageCode: curationStatement.statementLanguageCode,
});

export const constructArticleCardViewModel = (
  ports: Dependencies,
) => (articleId: Doi): TE.TaskEither<ArticleErrorCardViewModel, ArticleCardViewModel> => pipe(
  ports.getActivityForDoi(articleId),
  (articleActivity) => pipe(
    articleActivity.articleId,
    getArticleDetails(ports),
    TE.bimap(
      (error) => ({
        ...articleActivity,
        href: `/articles/${articleId.value}`,
        error,
      }),
      (articleDetails) => ({
        ...articleDetails,
        articleActivity,
      }),
    ),
  ),
  TE.chainW((partial) => pipe(
    {
      latestVersionDate: getLatestArticleVersionDate(ports)(articleId, partial.server),
      curationStatements: constructCurationStatements(ports, articleId),
    },
    sequenceS(T.ApplyPar),
    T.map(({ latestVersionDate, curationStatements }) => ({
      articleId: partial.articleId,
      articleLink: `/articles/activity/${partial.articleId.value}`,
      title: partial.title,
      authors: partial.authors,
      latestVersionDate,
      latestActivityAt: partial.articleActivity.latestActivityAt,
      evaluationCount: pipe(
        partial.articleActivity.evaluationCount === 0,
        B.fold(
          () => O.some(partial.articleActivity.evaluationCount),
          () => O.none,
        ),
      ),
      listMembershipCount: pipe(
        partial.articleActivity.listMembershipCount === 0,
        B.fold(
          () => O.some(partial.articleActivity.listMembershipCount),
          () => O.none,
        ),
      ),
      curationStatementsTeasers: pipe(
        curationStatements,
        RA.map(transformIntoCurationStatementViewModel),
      ),
    })),
    TE.rightTask,
  )),
);
