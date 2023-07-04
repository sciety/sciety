import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderErrorPage } from './render-as-html/render-error-page';
import { renderAsHtml } from './render-as-html/render-as-html';
import { constructViewModel, Params } from './construct-view-model/construct-view-model';
import { Dependencies } from './construct-view-model/dependencies';

export const page = (ports: Dependencies) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  params,
  constructViewModel(ports),
  TE.bimap(renderErrorPage, renderAsHtml),
);
