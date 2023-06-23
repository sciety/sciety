import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { CurationStatementWithGroupAndContent, constructCurationStatements } from '../construct-curation-statements';
import { ArticleCardViewModel, getLatestArticleVersionDate } from '.';
import { Doi } from '../../types/doi';
import { Queries } from '../../shared-read-models';
import { ArticleErrorCardViewModel } from './render-article-error-card';
import { Ports as GetLatestArticleVersionDatePorts } from './get-latest-article-version-date';
import { fetchArticleDetails } from './fetch-article-details';
import {
  FetchArticle, FetchRelatedArticles, FetchReview, FindVersionsForArticleDoi, Logger,
} from '../../shared-ports';
import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { CurationStatementTeaserViewModel } from './render-article-card';

export type Ports = Queries
& GetLatestArticleVersionDatePorts
& {
  fetchArticle: FetchArticle,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  logger: Logger,
};

const getArticleDetails = (ports: Ports) => fetchArticleDetails(
  getLatestArticleVersionDate(ports),
  ports.fetchArticle,
);
const transformIntoCurationStatementViewModel = (
  curationStatement: CurationStatementWithGroupAndContent,
): CurationStatementTeaserViewModel => ({
  groupName: curationStatement.groupName,
  quote: sanitise(toHtmlFragment(curationStatement.statement)),
  quoteLanguageCode: curationStatement.statementLanguageCode,
});

export const constructArticleCardViewModel = (
  ports: Ports,
) => (articleId: Doi): TE.TaskEither<ArticleErrorCardViewModel, ArticleCardViewModel> => pipe(
  articleId,
  getArticleDetails(ports),
  TE.mapLeft((error) => ({
    ...pipe(
      ports.getActivityForDoi(articleId),
    ),
    href: `/articles/${articleId.value}`,
    error,
  })),
  TE.chainW((articleDetails) => pipe(
    {
      latestVersionDate: getLatestArticleVersionDate(ports)(articleId, articleDetails.server),
      articleActivity: pipe(
        ports.getActivityForDoi(articleId),
        T.of,
      ),
      curationStatements: constructCurationStatements(ports, articleId),
    },
    sequenceS(T.ApplyPar),
    T.map(({ latestVersionDate, articleActivity, curationStatements }) => ({
      articleId: articleDetails.articleId,
      articleLink: `/articles/activity/${articleDetails.articleId.value}`,
      title: articleDetails.title,
      authors: articleDetails.authors,
      latestVersionDate,
      latestActivityAt: articleActivity.latestActivityAt,
      evaluationCount: pipe(
        articleActivity.evaluationCount === 0,
        B.fold(
          () => O.some(articleActivity.evaluationCount),
          () => O.none,
        ),
      ),
      listMembershipCount: pipe(
        articleActivity.listMembershipCount === 0,
        B.fold(
          () => O.some(articleActivity.listMembershipCount),
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
