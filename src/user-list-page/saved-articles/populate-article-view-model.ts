import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { ArticleViewModel } from '../../shared-components/article-card';
import { getActivityForDoi } from '../../shared-read-models/article-activity';
import { getEvaluationsForDoi } from '../../shared-read-models/evaluations';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type ArticleItem = {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

type Ports = {
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const populateArticleViewModel = (
  ports: Ports,
) => (item: ArticleItem): TE.TaskEither<DE.DataError, ArticleViewModel> => pipe(
  ports.getAllEvents,
  T.map(getEvaluationsForDoi(item.doi)),
  T.chain(flow(
    (reviews) => ({
      latestVersionDate: ports.getLatestArticleVersionDate(item.doi, item.server),
      latestActivityDate: pipe(
        ports.getAllEvents,
        T.map(getActivityForDoi(item.doi)),
        T.map((activity) => activity.latestActivityDate),
      ),
      evaluationCount: T.of(reviews.length),
    }),
    sequenceS(T.ApplyPar),
  )),
  T.map(({ latestVersionDate, latestActivityDate, evaluationCount }) => ({
    ...item,
    latestVersionDate,
    latestActivityDate,
    evaluationCount,
  })),
  TE.rightTask,
);
