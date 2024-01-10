import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import { constant, pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import { PaperExpressionEvent, FeedEvent, getFeedEventsContent } from './get-feed-events-content';
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

const toPaperExpressionEvent = (paperExpression: PaperExpression): PaperExpressionEvent => ({
  type: 'expression-published' as const,
  ...paperExpression,
  source: paperExpression.publisherHtmlUrl,
  doi: paperExpression.expressionDoi,
});

export const getArticleFeedEventsByDateDescending: GetArticleFeedEventsByDateDescending = (
  dependencies,
) => (
  expressionDoi, server,
) => pipe(
  dependencies.findAllExpressionsOfPaper(expressionDoi, server),
  T.map((expressionsOfPaper) => ({
    evaluations: pipe(
      expressionsOfPaper,
      E.match(
        () => [expressionDoi],
        (foundExpressions) => pipe(
          foundExpressions,
          RA.map((expression) => expression.expressionDoi),
        ),
      ),
      dependencies.getEvaluationsOfMultipleExpressions,
      RA.map((evaluation) => ({
        ...evaluation,
        type: 'evaluation-published' as const,
      })),
    ),
    expressions: pipe(
      expressionsOfPaper,
      E.matchW(
        constant([]),
        RNEA.map(toPaperExpressionEvent),
      ),
    ),
  })),
  T.map((feeds) => [...feeds.evaluations, ...feeds.expressions]),
  T.map(RA.sort(byDateDescending)),
  T.chain(getFeedEventsContent(dependencies)),
  T.map(handleArticleVersionErrors(server)),
);
