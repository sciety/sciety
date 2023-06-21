import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel, getLatestArticleVersionDate } from '.';
import { Doi } from '../../types/doi';
import { Queries } from '../../shared-read-models';
import { getCurationStatements } from './get-curation-statements';
import { ArticleErrorCardViewModel } from '../../html-pages/list-page/render-as-html/render-article-error-card';
import { Ports as GetLatestArticleVersionDatePorts } from './get-latest-article-version-date';
import { fetchArticleDetails } from './fetch-article-details';
import { FetchArticle } from '../../shared-ports';

export type Ports = Pick<Queries, 'getActivityForDoi'>
& GetLatestArticleVersionDatePorts
& { fetchArticle: FetchArticle };

const getArticleDetails = (ports: Ports) => fetchArticleDetails(
  getLatestArticleVersionDate(ports),
  ports.fetchArticle,
);

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
    },
    sequenceS(T.ApplyPar),
    T.map(({ latestVersionDate, articleActivity }) => ({
      articleId: articleDetails.articleId,
      title: articleDetails.title,
      authors: articleDetails.authors,
      latestVersionDate,
      latestActivityAt: articleActivity.latestActivityAt,
      evaluationCount: articleActivity.evaluationCount,
      listMembershipCount: articleActivity.listMembershipCount,
      curationStatements: getCurationStatements(articleId),
    })),
    TE.rightTask,
  )),
);
