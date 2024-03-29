import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../../types/expression-doi';
import { PaperActivitySummaryCardViewModel, constructPaperActivitySummaryCard } from '../../../shared-components/paper-activity-summary-card';
import { ExpressionActivity } from '../../../types/expression-activity';
import { Dependencies } from './dependencies';

type PopulateArticleViewModelsSkippingFailures = (
  dependencies: Dependencies,
) => (
  activities: ReadonlyArray<ExpressionActivity>
) => T.Task<ReadonlyArray<PaperActivitySummaryCardViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  dependencies,
) => (activities) => pipe(
  activities,
  RA.map((activity) => pipe(
    EDOI.fromValidatedString(activity.expressionDoi.value),
    constructPaperActivitySummaryCard(dependencies),
    TO.fromTaskEither,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
