import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleServer } from '../types/article-server';
import { ExpressionDoi } from '../types/expression-doi';
import { PaperExpression } from '../types/paper-expression';
import * as DE from '../types/data-error';
import { SupportedArticleServer } from './biorxiv/article-server-with-version-information';

export type GetExpressionsFromBiorxiv = (expressionDoi: ExpressionDoi, server: SupportedArticleServer)
=> TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>>;

export const replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes = (
  getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv,
  server: ArticleServer,
  expressionDoi: ExpressionDoi,
) => (
  expressionsFromCrossref: ReadonlyArray<PaperExpression>,
): TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>> => {
  const relevantExpressions = pipe(
    expressionsFromCrossref,
    RA.filter((expression) => O.isSome(expression.server) && (expression.server.value === 'biorxiv' || expression.server.value === 'medrxiv')),
  );

  if (relevantExpressions.length === 0) {
    return TE.right(expressionsFromCrossref);
  }

  if (server === 'biorxiv' || server === 'medrxiv') {
    return pipe(
      getExpressionsFromBiorxiv(expressionDoi, server),
      TE.map((expressionsFromBiorxiv) => [
        expressionsFromBiorxiv,
        pipe(
          expressionsFromCrossref,
          RA.filter((paperExpression) => paperExpression.expressionDoi !== expressionDoi),
        ),
      ]),
      TE.map(RA.flatten),
    );
  }
  return TE.right(expressionsFromCrossref);
};
