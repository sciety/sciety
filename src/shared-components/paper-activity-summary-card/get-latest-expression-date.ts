import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { Dependencies } from './dependencies';

type GetLatestExpressionDate = (
  dependencies: Dependencies,
) => (expressionDoi: ExpressionDoi) => TO.TaskOption<Date>;

export const getLatestExpressionDate: GetLatestExpressionDate = (
  dependencies,
) => (
  expressionDoi,
) => pipe(
  dependencies.findAllExpressionsOfPaper(expressionDoi),
  T.map(
    E.chainOptionKW(
      () => DE.notFound,
    )((allExpressions) => pipe(
      allExpressions.expressions,
      RA.last,
      O.map((version) => version.publishedAt),
    )),
  ),
  TO.fromTaskEither,
);
