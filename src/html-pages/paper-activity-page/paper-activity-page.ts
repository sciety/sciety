import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { constructViewModel, paramsCodec } from './construct-view-model';
import { renderAsHtml, toErrorPage } from './render-as-html';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';
import { ConstructPageResult } from '../construct-page';
import { Params } from './construct-view-model/construct-view-model';

const displayAPage = (dependencies: Dependencies) => (decodedParams: Params) => pipe(
  decodedParams,
  constructViewModel(dependencies),
  TE.map(renderAsHtml),
);

type PaperActivityPage = (dependencies: Dependencies)
=> (params: unknown)
=> TE.TaskEither<ErrorPageBodyViewModel, ConstructPageResult>;

export const paperActivityPage: PaperActivityPage = (dependencies) => (params) => pipe(
  params,
  paramsCodec.decode,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.chain(displayAPage(dependencies)),
  TE.mapLeft(toErrorPage),
);
