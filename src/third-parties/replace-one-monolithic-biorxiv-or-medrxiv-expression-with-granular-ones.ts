import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from '../types/expression-doi';
import { PaperExpression } from '../types/paper-expression';
import * as DE from '../types/data-error';
import { SupportedArticleServer, isSupportedArticleServer } from './biorxiv/article-server-with-version-information';

type PaperExpressionFromRelevantServer = {
  expressionDoi: ExpressionDoi,
  server: SupportedArticleServer,
};

export type GetExpressionsFromBiorxiv = (expressionDoi: ExpressionDoi, server: SupportedArticleServer)
=> TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>>;

const toRelevantExpression = (expression: PaperExpression): O.Option<PaperExpressionFromRelevantServer> => pipe(
  expression.server,
  O.filter(isSupportedArticleServer),
  O.map((server) => ({
    expressionDoi: expression.expressionDoi,
    server,
  })),
);

export const replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes = (
  getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv,
  expressionDoi: ExpressionDoi,
) => (
  expressionsFromCrossref: ReadonlyArray<PaperExpression>,
): TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>> => {
  const relevantExpressions = pipe(
    expressionsFromCrossref,
    RA.filterMap(toRelevantExpression),
  );

  if (relevantExpressions.length === 0) {
    return TE.right(expressionsFromCrossref);
  }

  return pipe(
    getExpressionsFromBiorxiv(expressionDoi, relevantExpressions[0].server),
    TE.map((expressionsFromBiorxiv) => [
      expressionsFromBiorxiv,
      pipe(
        expressionsFromCrossref,
        RA.filter((paperExpression) => paperExpression.expressionDoi !== expressionDoi),
      ),
    ]),
    TE.map(RA.flatten),
  );
};
