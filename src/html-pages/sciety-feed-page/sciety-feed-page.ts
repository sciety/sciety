import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderErrorPage } from './render-as-html/render-error-page';
import { renderAsHtml } from './render-as-html/render-as-html';
import { Params, Dependencies, constructViewModel } from './construct-view-model';

export const scietyFeedPage = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  params,
  constructViewModel(dependencies, pageSize),
  TE.bimap(renderErrorPage, renderAsHtml),
);
