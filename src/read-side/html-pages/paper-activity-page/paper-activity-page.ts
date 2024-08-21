import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './construct-view-model/dependencies';
import { identifyLatestExpressionDoiOfTheSamePaper } from './identify-latest-expression-doi-of-the-same-paper';
import { renderAsHtml } from './render-as-html';
import { constructPaperActivityPageHref } from '../../../standards/paths';
import { ExpressionDoi, expressionDoiCodec } from '../../../types/expression-doi';
import { userIdCodec } from '../../../types/user-id';
import { constructErrorPageViewModel } from '../construct-error-page-view-model';
import { ConstructPage } from '../construct-page';
import { decodePageParams } from '../decode-page-params';
import { toRedirectTarget } from '../redirect-target';

const redirectTo = (expressionDoi: ExpressionDoi) => pipe(
  expressionDoi,
  constructPaperActivityPageHref,
  toRedirectTarget,
);

const isRequestedExpressionDoiInCanonicalForm = (
  input: { canonicalForm: ExpressionDoi, requestedExpressionDoi: ExpressionDoi },
) => input.canonicalForm === input.requestedExpressionDoi;

const isRequestedExpressionDoiTheLatest = (
  input: { latestExpressionDoi: ExpressionDoi, requestedExpressionDoi: ExpressionDoi },
) => input.latestExpressionDoi === input.requestedExpressionDoi;

const extendWithLatestExpressionDoi = (
  dependencies: Dependencies,
) => <A extends { canonicalForm: ExpressionDoi }>(input: A) => pipe(
  input.canonicalForm,
  identifyLatestExpressionDoiOfTheSamePaper(dependencies),
  TE.mapLeft(constructErrorPageViewModel),
  TE.map((latestExpressionDoi) => ({
    ...input,
    latestExpressionDoi,
  })),
);

const rawParamsCodec = t.type({
  expressionDoi: expressionDoiCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type RawParams = t.TypeOf<typeof rawParamsCodec>;

const extendWithCanonicalForm = (input: RawParams) => ({
  user: input.user,
  canonicalForm: input.expressionDoi.toLowerCase() as ExpressionDoi,
  requestedExpressionDoi: input.expressionDoi,
});

type PaperActivityPage = (dependencies: Dependencies) => ConstructPage;

export const paperActivityPage: PaperActivityPage = (dependencies) => (params) => pipe(
  params,
  decodePageParams(dependencies.logger, rawParamsCodec),
  TE.fromEither,
  TE.mapLeft(constructErrorPageViewModel),
  TE.map(extendWithCanonicalForm),
  TE.filterOrElseW(
    isRequestedExpressionDoiInCanonicalForm,
    ({ canonicalForm }) => redirectTo(canonicalForm),
  ),
  TE.chainW(extendWithLatestExpressionDoi(dependencies)),
  TE.filterOrElseW(
    isRequestedExpressionDoiTheLatest,
    ({ latestExpressionDoi }) => redirectTo(latestExpressionDoi),
  ),
  TE.chainW(flow(
    constructViewModel(dependencies),
    TE.mapLeft(constructErrorPageViewModel),
  )),
  TE.map(renderAsHtml),
);
