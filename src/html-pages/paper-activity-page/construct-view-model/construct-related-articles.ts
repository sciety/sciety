import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as EDOI from '../../../types/expression-doi';
import { constructPaperActivitySummaryCard } from '../../../shared-components/paper-activity-summary-card';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

export const constructRelatedArticles = (
  expressionDoi: EDOI.ExpressionDoi,
  dependencies: Dependencies,
): T.Task<ViewModel['relatedArticles']> => pipe(
  expressionDoi,
  dependencies.fetchRelatedArticles,
  TE.map(RA.takeLeft(3)),
  TE.chainW(TE.traverseArray(constructPaperActivitySummaryCard(dependencies))),
  TO.fromTaskEither,
);
