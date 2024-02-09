import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import * as DE from '../../types/data-error';
import { canonicalParamsCodec } from './construct-view-model';
import { toErrorPage, renderAsHtml } from './render-as-html';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPage, ConstructPageResult } from '../construct-page';
import { identifyLatestExpressionDoiOfTheSamePaper } from './identify-latest-expression-doi-of-the-same-paper';
import { paperActivityPagePath } from '../../standards';
import { RedirectTarget, toRedirectTarget } from '../redirect-target';
import { CanonicalParams, constructViewModel } from './construct-view-model/construct-view-model';
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

const displayAPage = (
  dependencies: Dependencies,
) => (
  decodedParams: CanonicalParams,
): TE.TaskEither<ErrorPageBodyViewModel | RedirectTarget, ConstructPageResult> => pipe(
  decodedParams,
  constructViewModel(dependencies),
  TE.map(renderAsHtml),
  TE.mapLeft(toErrorPage),
);

const isCanonicalExpressionDoi = (input: string) => {
  const canonicalForm = canonicalExpressionDoiCodec.decode(input);
  if (E.isLeft(canonicalForm)) {
    return false;
  }
  return canonicalForm.right === input;
};

type PaperActivityPage = (dependencies: Dependencies) => ConstructPage;

export const paperActivityPage: PaperActivityPage = (dependencies) => (params) => pipe(
  params,
  decodeCombinedParams,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.mapLeft(toErrorPage),
  TE.filterOrElseW(
    (combinedParams) => isCanonicalExpressionDoi(combinedParams.inputExpressionDoi),
    (combinedParams) => redirectTo(combinedParams.expressionDoi),
  ),
  TE.chainW((partial) => pipe(
    partial.expressionDoi,
    identifyLatestExpressionDoiOfTheSamePaper(dependencies),
    TE.mapLeft(toErrorPage),
    TE.map((latestExpressionDoi) => ({
      ...partial,
      latestExpressionDoi,
    })),
  )),
  TE.filterOrElseW(
    (combinedDecodedParams) => combinedDecodedParams.latestExpressionDoi === combinedDecodedParams.expressionDoi,
    (combinedDecodedParams) => redirectTo(combinedDecodedParams.latestExpressionDoi),
  ),
  TE.chainW((combinedDecodedParams) => pipe(
    combinedDecodedParams.expressionDoi,
    identifyLatestExpressionDoiOfTheSamePaper(dependencies),
    TE.mapLeft(toErrorPage),
    TE.filterOrElseW(
      (latestExpressionDoi) => latestExpressionDoi === combinedDecodedParams.expressionDoi,
      redirectTo,
    ),
    TE.chain(() => displayAPage(dependencies)(combinedDecodedParams)),
  )),
);
