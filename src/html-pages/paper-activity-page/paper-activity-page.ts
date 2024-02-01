import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { paramsCodec } from './construct-view-model';
import { toErrorPage } from './render-as-html';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPageResult } from '../construct-page';
import { decideWhetherToRedirectOrDisplayAPage } from './decide-whether-to-redirect-or-display-a-page';

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
