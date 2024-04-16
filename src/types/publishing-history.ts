import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { ExpressionDoi } from './expression-doi';
import * as PE from './paper-expression';
import { publishedAtWithUnambiguousCriteria } from './paper-expression';

export type PublishingHistory = {
  expressions: RNEA.ReadonlyNonEmptyArray<PE.PaperExpression>,
  preprintExpressions: RNEA.ReadonlyNonEmptyArray<PE.PaperExpression>,
};

export const getLatestExpression = (history: PublishingHistory): PE.PaperExpression => pipe(
  history.expressions,
  RNEA.sortBy(publishedAtWithUnambiguousCriteria),
  RNEA.last,
);

export const getAllExpressions = (history: PublishingHistory): ReadonlyArray<PE.PaperExpression> => (
  history.expressions
);

export const getAllExpressionDois = (history: PublishingHistory): ReadonlyArray<ExpressionDoi> => pipe(
  history.expressions,
  RA.map((expression) => expression.expressionDoi),
);

export const getLatestPreprintExpression = (history: PublishingHistory): PE.PaperExpression => pipe(
  history.preprintExpressions,
  RNEA.sortBy(publishedAtWithUnambiguousCriteria),
  RNEA.last,
);

export type PublishingHistoryFailure = 'empty-publishing-history' | 'no-preprints-in-publishing-history';

export const fromExpressions = (
  candidateExpressions: ReadonlyArray<PE.PaperExpression>,
): E.Either<PublishingHistoryFailure, PublishingHistory> => pipe(
  candidateExpressions,
  RNEA.fromReadonlyArray,
  E.fromOption(() => 'empty-publishing-history' as const),
  E.chainW((expressions) => pipe(
    expressions,
    RNEA.filter((expression) => expression.expressionType === 'preprint'),
    O.map((preprintExpressions) => ({
      expressions,
      preprintExpressions,
    })),
    E.fromOption(() => 'no-preprints-in-publishing-history' as const),
  )),
);
