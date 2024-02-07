import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import * as DE from '../../types/data-error';
import { canonicalParamsCodec } from './construct-view-model';
import { toErrorPage } from './render-as-html';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPageResult } from '../construct-page';
import { displayAPage, identifyLatestExpressionDoiOfTheSamePaper } from './decide-whether-to-redirect-or-display-a-page';
import { paperActivityPagePath } from '../../standards';
import { toRedirectTarget } from '../redirect-target';
import { CanonicalParams } from './construct-view-model/construct-view-model';
import { ExpressionDoi } from '../../types/expression-doi';

const inputParamsCodec = t.type({
  expressionDoi: t.string,
});

const decodeCombinedParams = (params: unknown) => pipe(
  params,
  canonicalParamsCodec.decode,
  E.chain((canonicalParams) => pipe(
    params,
    inputParamsCodec.decode,
    E.map((decodedInputParams) => decodedInputParams.expressionDoi),
    E.map((inputExpressionDoi) => ({
      ...canonicalParams,
      inputExpressionDoi,
    })),
  )),
);

type CombinedParams = CanonicalParams & {
  inputExpressionDoi: string,
};

const redirectTo = (expressionDoi: ExpressionDoi) => pipe(
  expressionDoi,
  paperActivityPagePath,
  toRedirectTarget,
  TE.right,
);

const redirectOrDisplayAPage = (dependencies: Dependencies) => (combinedDecodedParams: CombinedParams) => {
  if (combinedDecodedParams.inputExpressionDoi === combinedDecodedParams.expressionDoi) {
    return pipe(
      combinedDecodedParams.expressionDoi,
      identifyLatestExpressionDoiOfTheSamePaper(dependencies),
      TE.chain((latestExpressionDoi) => {
        if (latestExpressionDoi !== combinedDecodedParams.expressionDoi) {
          return redirectTo(latestExpressionDoi);
        }
        return pipe(
          combinedDecodedParams,
          displayAPage(dependencies),
        );
      }),
      TE.mapLeft(toErrorPage),
    );
  }
  return redirectTo(combinedDecodedParams.expressionDoi);
};

type PaperActivityPage = (dependencies: Dependencies)
=> (params: unknown)
=> TE.TaskEither<ErrorPageBodyViewModel, ConstructPageResult>;

export const paperActivityPage: PaperActivityPage = (dependencies) => (params) => pipe(
  params,
  decodeCombinedParams,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.mapLeft(toErrorPage),
  TE.chain(redirectOrDisplayAPage(dependencies)),
);
