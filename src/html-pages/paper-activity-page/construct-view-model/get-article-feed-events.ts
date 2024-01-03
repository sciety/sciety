import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { ArticleVersionEvent, FeedEvent, getFeedEventsContent } from './get-feed-events-content';
import { handleArticleVersionErrors } from './handle-article-version-errors';
import { ArticleServer } from '../../../types/article-server';
import { FeedItem } from '../view-model';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../types/expression-doi';
import { PaperExpression } from '../../../types/paper-expression';

const byDate: Ord.Ord<FeedEvent> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedEvent> = pipe(
  byDate,
  Ord.reverse,
);

type GetArticleFeedEventsByDateDescending = (dependencies: Dependencies)
=> (expressionDoi: ExpressionDoi, server: ArticleServer)
=> T.Task<RNEA.ReadonlyNonEmptyArray<FeedItem>>;

const toArticleVersionEvent = (paperExpression: PaperExpression): ArticleVersionEvent => ({
  type: 'article-version' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
});

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  dependencies,
) => (
  expressionDoi, server,
) => pipe(
  dependencies.findAllExpressionsOfPaper(expressionDoi, server),
  T.map((expressionsOfPaper) => ({
    evaluations: pipe(
      [expressionDoi],
      dependencies.getEvaluationsOfMultipleExpressions,
      RA.map((evaluation) => ({
        ...evaluation,
        type: 'evaluation' as const,
      })),
    ),
    versions: pipe(
      expressionsOfPaper,
      O.matchW(
        constant([]),
        RNEA.map(toArticleVersionEvent),
      ),
    ),
  })),
  T.map((feeds) => [...feeds.evaluations, ...feeds.versions]),
  T.map(RA.sort(byDateDescending)),
  T.chain(getFeedEventsContent(dependencies, server)),
  T.map(handleArticleVersionErrors(server)),
);
