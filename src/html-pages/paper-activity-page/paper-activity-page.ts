import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import * as DE from '../../types/data-error';
import { canonicalParamsCodec } from './construct-view-model';
import { toErrorPage, renderAsHtml } from './render-as-html';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPageResult } from '../construct-page';
import { identifyLatestExpressionDoiOfTheSamePaper } from './identify-latest-expression-doi-of-the-same-paper';
import { paperActivityPagePath } from '../../standards';
import { toRedirectTarget } from '../redirect-target';
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

type CombinedParams = CanonicalParams & {
  inputExpressionDoi: string,
};

const redirectTo = (expressionDoi: ExpressionDoi) => pipe(
  expressionDoi,
  paperActivityPagePath,
  toRedirectTarget,
  TE.right,
);

const displayAPage = (
  dependencies: Dependencies,
) => (
  decodedParams: CanonicalParams,
): TE.TaskEither<ErrorPageBodyViewModel, ConstructPageResult> => pipe(
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

const redirectOrDisplayAPage = (dependencies: Dependencies) => (combinedDecodedParams: CombinedParams) => {
  if (!isCanonicalExpressionDoi(combinedDecodedParams.inputExpressionDoi)) {
    return redirectTo(combinedDecodedParams.expressionDoi);
  }
  return pipe(
    combinedDecodedParams.expressionDoi,
    identifyLatestExpressionDoiOfTheSamePaper(dependencies),
    TE.mapLeft(toErrorPage),
    TE.chain((latestExpressionDoi) => {
      if (latestExpressionDoi !== combinedDecodedParams.expressionDoi) {
        return redirectTo(latestExpressionDoi);
      }
      return pipe(
        combinedDecodedParams,
        displayAPage(dependencies),
      );
    }),
  );
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
