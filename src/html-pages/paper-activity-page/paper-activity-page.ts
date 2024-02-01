import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { constructViewModel, paramsCodec } from './construct-view-model';
import { renderAsHtml, toErrorPage } from './render-as-html';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPageResult } from '../construct-page';
import { Params } from './construct-view-model/construct-view-model';
import { toRedirectTarget } from '../redirect-target';
import { paperActivityPagePath } from '../../standards';
import { ExpressionDoi } from '../../types/expression-doi';
import * as PH from '../../types/publishing-history';

const displayAPage = (dependencies: Dependencies) => (decodedParams: Params) => pipe(
  decodedParams,
  constructViewModel(dependencies),
  TE.map(renderAsHtml),
);

const identifyLatestExpressionDoiOfTheSamePaper = (
  dependencies: Dependencies,
) => (
  expressionDoi: ExpressionDoi,
) => pipe(
  expressionDoi,
  dependencies.fetchPublishingHistory,
  TE.map((publishingHistory) => PH.getLatestExpression(publishingHistory).expressionDoi),
);

const decideWhetherToRedirectOrDisplayAPage = (
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

type PaperActivityPage = (dependencies: Dependencies)
=> (params: unknown)
=> TE.TaskEither<ErrorPageBodyViewModel, ConstructPageResult>;

export const paperActivityPage: PaperActivityPage = (dependencies) => (params) => pipe(
  params,
  paramsCodec.decode,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.chain(decideWhetherToRedirectOrDisplayAPage(dependencies)),
  TE.mapLeft(toErrorPage),
);
