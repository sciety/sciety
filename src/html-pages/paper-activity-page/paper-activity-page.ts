import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import * as DE from '../../types/data-error';
import { canonicalParamsCodec } from './construct-view-model';
import { toErrorPage, renderAsHtml } from './render-as-html';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPage } from '../construct-page';
import { identifyLatestExpressionDoiOfTheSamePaper } from './identify-latest-expression-doi-of-the-same-paper';
import { paperActivityPagePath } from '../../standards';
import { toRedirectTarget } from '../redirect-target';
import { constructViewModel } from './construct-view-model/construct-view-model';
import { ExpressionDoi, canonicalExpressionDoiCodec } from '../../types/expression-doi';

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

const redirectTo = (expressionDoi: ExpressionDoi) => pipe(
  expressionDoi,
  paperActivityPagePath,
  toRedirectTarget,
);

const isCanonicalExpressionDoi = (
  input: { inputExpressionDoi: string, expressionDoi: ExpressionDoi },
) => {
  const canonicalForm = canonicalExpressionDoiCodec.decode(input.inputExpressionDoi);
  if (E.isLeft(canonicalForm)) {
    return false;
  }
  return canonicalForm.right === input.inputExpressionDoi;
};

const isRequestedExpressionDoiTheLatest = (
  input: { latestExpressionDoi: ExpressionDoi, expressionDoi: ExpressionDoi },
) => input.latestExpressionDoi === input.expressionDoi;

const extendWithLatestExpressionDoi = (
  dependencies: Dependencies,
) => <A extends { expressionDoi: ExpressionDoi }>(input: A) => pipe(
  input.expressionDoi,
  identifyLatestExpressionDoiOfTheSamePaper(dependencies),
  TE.mapLeft(toErrorPage),
  TE.map((latestExpressionDoi) => ({
    ...input,
    latestExpressionDoi,
  })),
);

type PaperActivityPage = (dependencies: Dependencies) => ConstructPage;

export const paperActivityPage: PaperActivityPage = (dependencies) => (params) => pipe(
  params,
  decodeCombinedParams,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.mapLeft(toErrorPage),
  TE.filterOrElseW(
    isCanonicalExpressionDoi,
    (combinedParams) => redirectTo(combinedParams.expressionDoi),
  ),
  TE.chainW(extendWithLatestExpressionDoi(dependencies)),
  TE.filterOrElseW(
    isRequestedExpressionDoiTheLatest,
    (combinedDecodedParams) => redirectTo(combinedDecodedParams.latestExpressionDoi),
  ),
  TE.chainW(flow(
    constructViewModel(dependencies),
    TE.mapLeft(toErrorPage),
  )),
  TE.map(renderAsHtml),
);
