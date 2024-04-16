import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { constructViewModel } from './construct-view-model/construct-view-model';
import { Dependencies } from './construct-view-model/dependencies';
import { identifyLatestExpressionDoiOfTheSamePaper } from './identify-latest-expression-doi-of-the-same-paper';
import { toErrorPage, renderAsHtml } from './render-as-html';
import { constructPaperActivityPageHref } from '../../read-side/paths';
import * as DE from '../../types/data-error';
import { ExpressionDoi, canonicalExpressionDoiCodec } from '../../types/expression-doi';
import { userIdCodec } from '../../types/user-id';
import { ConstructPage } from '../construct-page';
import { toRedirectTarget } from '../redirect-target';

const canonicalParamsCodec = t.type({
  expressionDoi: canonicalExpressionDoiCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

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
  constructPaperActivityPageHref,
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
