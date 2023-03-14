import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderErrorPage } from './render-as-html/render-error-page';
import { renderAsHtml } from './render-as-html/render-as-html';
import { constructViewModel, Params, Ports } from './construct-view-model/construct-view-model';

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  params,
  constructViewModel(ports),
  TE.bimap(renderErrorPage, renderAsHtml),
);
