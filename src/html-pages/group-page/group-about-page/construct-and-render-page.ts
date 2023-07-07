import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../../types/page';
import { RenderPageError } from '../../../types/render-page-error';
import { renderAsHtml } from './render-as-html/render-as-html';
import { renderErrorPage } from './render-as-html/render-error-page';
import { constructViewModel, Dependencies, Params } from './construct-view-model/construct-view-model';

type GroupPage = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const constructAndRenderPage: GroupPage = (dependencies) => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);
