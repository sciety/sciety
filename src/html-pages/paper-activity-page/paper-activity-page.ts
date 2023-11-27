import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { constructViewModel, paramsCodec } from './construct-view-model';
import { renderAsHtml, toErrorPage } from './render-as-html';
import { HtmlPage } from '../html-page';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';

type PaperActivityPage = (dependencies: Dependencies)
=> (params: unknown)
=> TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const paperActivityPage: PaperActivityPage = (dependencies) => (params) => pipe(
  params,
  paramsCodec.decode,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.chain(constructViewModel(dependencies)),
  TE.bimap(toErrorPage, renderAsHtml),
);
