import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { constant, pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { sequenceS } from 'fp-ts/Apply';
import { FeedEvent, getFeedEventsContent } from './get-feed-events-content';
import { handleArticleVersionErrors } from './handle-article-version-errors';
import { ArticleServer } from '../../../types/article-server';
import { ArticleId } from '../../../types/article-id';
import { FeedItem } from '../view-model';
import { Dependencies } from './dependencies';
import { PaperId } from '../../../third-parties';

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

type GetArticleFeedEventsByDateDescending = (dependencies: Dependencies)
=> (paperId: PaperId, server: ArticleServer)
=> T.Task<RNEA.ReadonlyNonEmptyArray<FeedItem>>;

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  dependencies,
) => (
  paperId, server,
) => pipe(
  new ArticleId(paperId),
  (articleId) => ({
    evaluations: pipe(
      dependencies.getEvaluationsForArticle(articleId),
      T.of,
      T.map(RA.map((evaluation) => ({
        ...evaluation,
        type: 'evaluation' as const,
      }))),
    ),
    versions: pipe(
      dependencies.findVersionsForArticleDoi(articleId, server),
      TO.matchW(
        constant([]),
        RNEA.map((version) => ({
          type: 'article-version' as const,
          ...version,
        })),
      ),
    ),
  }),
  sequenceS(T.ApplyPar),
  T.map((feeds) => [...feeds.evaluations, ...feeds.versions]),
  T.map(RA.sort(byDateDescending)),
  T.chain(getFeedEventsContent(dependencies, server)),
  T.map(handleArticleVersionErrors(server)),
);