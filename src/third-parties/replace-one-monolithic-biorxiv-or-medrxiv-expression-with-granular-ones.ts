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

const unaffectedExpressions = (
  expressionsFromCrossref: ReadonlyArray<PaperExpression>,
  affectedExpressions: ReadonlyArray<PaperExpressionFromRelevantServer>,
) => {
  const affectedExpressionDois = pipe(
    affectedExpressions,
    RA.map((expression) => expression.expressionDoi),
  );
  return pipe(
    expressionsFromCrossref,
    RA.filter((paperExpression) => !affectedExpressionDois.includes(paperExpression.expressionDoi)),
  );
};

const replaceFirstRelevantExpression = (
  getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv,
  expressionsFromCrossref: ReadonlyArray<PaperExpression>,
) => (relevantExpressions: ReadonlyArray<PaperExpressionFromRelevantServer>) => pipe(
  relevantExpressions,
  TE.traverseArray((relevantExpression) => getExpressionsFromBiorxiv(
    relevantExpression.expressionDoi,
    relevantExpression.server,
  )),
  TE.map(RA.flatten),
  TE.map((expressionsFromBiorxiv) => [
    expressionsFromBiorxiv,
    unaffectedExpressions(expressionsFromCrossref, relevantExpressions),
  ]),
  TE.map(RA.flatten),
);

export const replaceOneMonolithicBiorxivOrMedrxivExpressionWithGranularOnes = (
  getExpressionsFromBiorxiv: GetExpressionsFromBiorxiv,
) => (
  expressionsFromCrossref: ReadonlyArray<PaperExpression>,
): TE.TaskEither<DE.DataError, ReadonlyArray<PaperExpression>> => pipe(
  expressionsFromCrossref,
  RA.filterMap(toRelevantExpression),
  RA.match(
    () => TE.right(expressionsFromCrossref),
    replaceFirstRelevantExpression(getExpressionsFromBiorxiv, expressionsFromCrossref),
  ),
);
