import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as D from 'fp-ts/Date';
import * as DE from '../../types/data-error';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPageResult } from '../construct-page';
import { Params, constructViewModel } from './construct-view-model/construct-view-model';
import { toRedirectTarget } from '../redirect-target';
import { paperActivityPagePath } from '../../standards';
import { ExpressionDoi } from '../../types/expression-doi';
import * as PH from '../../types/publishing-history';
import { renderAsHtml } from './render-as-html';

const logWhenDuplicateExpressionDatesFound = (
  dependencies: Dependencies,
  expressionDoi: ExpressionDoi,
) => (history: PH.PublishingHistory) => {
  pipe(
    history.expressions,
    RA.map((expression) => expression.publishedAt),
    RA.uniq(D.Eq),
    (uniqueDates) => {
      if (uniqueDates.length !== history.expressions.length) {
        dependencies.logger('debug', 'Expressions with duplicate dates found for a publishing history', { expressionDoi });
      }
    },
  );
  return history;
};

const identifyLatestExpressionDoiOfTheSamePaper = (
  dependencies: Dependencies,
) => (
  expressionDoi: ExpressionDoi,
) => pipe(
  expressionDoi,
  dependencies.fetchPublishingHistory,
  TE.map(logWhenDuplicateExpressionDatesFound(dependencies, expressionDoi)),
  TE.map((publishingHistory) => PH.getLatestExpression(publishingHistory).expressionDoi),
);

const displayAPage = (
  dependencies: Dependencies,
) => (
  decodedParams: Params,
): TE.TaskEither<DE.DataError, ConstructPageResult> => pipe(
  decodedParams,
  constructViewModel(dependencies),
  TE.map(renderAsHtml),
);

export const decideWhetherToRedirectOrDisplayAPage = (
  dependencies: Dependencies,
) => (
  decodedParams: Params,
): TE.TaskEither<DE.DataError, ConstructPageResult> => pipe(
  decodedParams.expressionDoi,
  identifyLatestExpressionDoiOfTheSamePaper(dependencies),
  TE.chain((latestExpressionDoi) => {
    if (latestExpressionDoi !== decodedParams.expressionDoi) {
      return pipe(
        latestExpressionDoi,
        paperActivityPagePath,
        toRedirectTarget,
        TE.right,
      );
    }
    return pipe(
      decodedParams,
      displayAPage(dependencies),
    );
  }),
);
