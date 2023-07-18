import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderErrorPage } from './render-as-html/render-error-page';
import { renderAsHtml } from './render-as-html/render-as-html';
import { constructViewModel, Params, Dependencies } from './construct-view-model';

export const page = (dependencies: Dependencies) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);
