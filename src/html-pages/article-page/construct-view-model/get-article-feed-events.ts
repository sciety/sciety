import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { constant, pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { sequenceS } from 'fp-ts/Apply';
import { FeedEvent, getFeedEventsContent, Ports as GetFeedEventsContentPorts } from './get-feed-events-content';
import { handleArticleVersionErrors } from './handle-article-version-errors';
import { ArticleServer } from '../../../types/article-server';
import { Doi } from '../../../types/doi';
import { FeedItem } from '../view-model';
import { FindVersionsForArticleDoi } from '../../../shared-ports';
import { Queries } from '../../../shared-read-models';

export type Ports = GetFeedEventsContentPorts & {
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getEvaluationsForDoi: Queries['getEvaluationsForDoi'],
};

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

type GetArticleFeedEventsByDateDescending = (adapters: Ports)
=> (doi: Doi, server: ArticleServer)
=> T.Task<RNEA.ReadonlyNonEmptyArray<FeedItem>>;

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  adapters,
) => (
  doi, server,
) => pipe(
  {
    evaluations: pipe(
      adapters.getEvaluationsForDoi(doi),
      T.of,
      T.map(RA.map((evaluation) => ({
        type: 'evaluation' as const,
        evaluationLocator: evaluation.reviewId,
        ...evaluation,
      }))),
    ),
    versions: pipe(
      adapters.findVersionsForArticleDoi(doi, server),
      TO.matchW(
        constant([]),
        RNEA.map((version) => ({
          type: 'article-version' as const,
          ...version,
        })),
      ),
    ),
  },
  sequenceS(T.ApplyPar),
  T.map((feeds) => [...feeds.evaluations, ...feeds.versions]),
  T.map(RA.sort(byDateDescending)),
  T.chain(getFeedEventsContent(adapters, server)),
  T.map(handleArticleVersionErrors(server)),
);
