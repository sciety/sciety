import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as DE from '../../types/data-error';
import { canonicalParamsCodec } from './construct-view-model';
import { toErrorPage } from './render-as-html';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPageResult } from '../construct-page';
import { decideWhetherToRedirectOrDisplayAPage } from './decide-whether-to-redirect-or-display-a-page';
import { userIdCodec } from '../../types/user-id';

const inputParamsCodec = t.type({
  expressionDoi: t.string,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

const decodingAndCanonicalization = (params: unknown) => pipe(
  params,
  canonicalParamsCodec.decode,
  E.map((canonicalParams) => ({
    ...canonicalParams,
    inputExpressionDoi: pipe(
      params,
      inputParamsCodec.decode,
    ),
  })),
);

type PaperActivityPage = (dependencies: Dependencies)
=> (params: unknown)
=> TE.TaskEither<ErrorPageBodyViewModel, ConstructPageResult>;

export const paperActivityPage: PaperActivityPage = (dependencies) => (params) => pipe(
  params,
  decodingAndCanonicalization,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.chain(decideWhetherToRedirectOrDisplayAPage(dependencies)),
  TE.mapLeft(toErrorPage),
);
