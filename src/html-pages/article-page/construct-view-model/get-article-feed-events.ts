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

const getEvaluationsForArticle = (dependencies: Dependencies): Dependencies['getEvaluationsForArticle'] => (articleId: ArticleId) => {
  if (articleId.value === '10.1099-acmi.0.000569.v1') {
    const realDoi = articleId.value.replace(/-/, '/');
    return dependencies.getEvaluationsForArticle(new ArticleId(realDoi));
  }
  return dependencies.getEvaluationsForArticle(articleId);
};

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

type GetArticleFeedEventsByDateDescending = (dependencies: Dependencies)
=> (doi: ArticleId, server: ArticleServer)
=> T.Task<RNEA.ReadonlyNonEmptyArray<FeedItem>>;

const findVersionsForArticleDoi = (
  dependencies: Dependencies,
  doi: ArticleId,
  server: ArticleServer,
) => {
  if (doi.value === '10.1099-acmi.0.000569.v1') {
    return dependencies.findVersionsForArticleDoi(doi, server);
  }
  return dependencies.findVersionsForArticleDoi(doi, server);
};

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  dependencies,
) => (
  doi, server,
) => pipe(
  {
    evaluations: pipe(
      doi,
      getEvaluationsForArticle(dependencies),
      T.of,
      T.map(RA.map((evaluation) => ({
        ...evaluation,
        type: 'evaluation' as const,
      }))),
    ),
    versions: pipe(
      // dependencies.findVersionsForArticleDoi(doi, server),
      findVersionsForArticleDoi(dependencies, doi, server),
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
  T.chain(getFeedEventsContent(dependencies, server)),
  T.map(handleArticleVersionErrors(server)),
);
