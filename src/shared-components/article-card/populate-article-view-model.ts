import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel, getLatestArticleVersionDate } from '.';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { Queries } from '../../shared-read-models';
import { getCurationStatements } from './get-curation-statements';
import { ArticleErrorCardViewModel } from '../../html-pages/list-page/render-as-html/render-article-error-card';
import { Ports as GetLatestArticleVersionDatePorts } from './get-latest-article-version-date';

type ArticleItem = {
  articleId: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

export type Ports = Pick<Queries, 'getActivityForDoi'>
& GetLatestArticleVersionDatePorts;

export const populateArticleViewModel = (
  ports: Ports,
) => (item: ArticleItem): TE.TaskEither<ArticleErrorCardViewModel, ArticleCardViewModel> => pipe(
  {
    latestVersionDate: getLatestArticleVersionDate(ports)(item.articleId, item.server),
    articleActivity: pipe(
      ports.getActivityForDoi(item.articleId),
      T.of,
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(({ latestVersionDate, articleActivity }) => ({
    ...item,
    latestVersionDate,
    latestActivityAt: articleActivity.latestActivityAt,
    evaluationCount: articleActivity.evaluationCount,
    listMembershipCount: articleActivity.listMembershipCount,
    curationStatements: getCurationStatements(item.articleId),
  })),
  TE.rightTask,
);
