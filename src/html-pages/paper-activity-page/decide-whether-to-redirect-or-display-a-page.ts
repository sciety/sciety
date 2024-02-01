import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPageResult } from '../construct-page';
import { Params, constructViewModel } from './construct-view-model/construct-view-model';
import { toRedirectTarget } from '../redirect-target';
import { paperActivityPagePath } from '../../standards';
import { ExpressionDoi } from '../../types/expression-doi';
import * as PH from '../../types/publishing-history';
import { renderAsHtml } from './render-as-html';

const identifyLatestExpressionDoiOfTheSamePaper = (
  dependencies: Dependencies,
) => (
  expressionDoi: ExpressionDoi,
) => pipe(
  expressionDoi,
  dependencies.fetchPublishingHistory,
  TE.map((publishingHistory) => PH.getLatestExpression(publishingHistory).expressionDoi),
);

const displayAPage = (dependencies: Dependencies) => (decodedParams: Params) => pipe(
  decodedParams,
  constructViewModel(dependencies),
  TE.map(renderAsHtml),
);

export const decideWhetherToRedirectOrDisplayAPage = (
  dependencies: Dependencies,
) => (
  decodedParams: Params,
): TE.TaskEither<DE.DataError, ConstructPageResult> => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    if (decodedParams.expressionDoi === '10.1101/2023.01.02.522517') {
      return pipe(
        decodedParams.expressionDoi,
        identifyLatestExpressionDoiOfTheSamePaper(dependencies),
        TE.map(paperActivityPagePath),
        TE.map(toRedirectTarget),
      );
    }
  }
  return pipe(
    decodedParams,
    displayAPage(dependencies),
  );
};
