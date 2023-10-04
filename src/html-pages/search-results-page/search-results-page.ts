import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params } from './construct-view-model/construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { RenderPageError } from '../../types/render-page-error';
import { HtmlPage } from '../../types/html-page';
import { renderErrorPage } from './render-as-html/render-error-page';
import { Dependencies, constructViewModel } from './construct-view-model';

type SearchResultsPage = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params) => TE.TaskEither<RenderPageError, HtmlPage>;

export const searchResultsPage: SearchResultsPage = (dependencies) => (pageSize) => (params) => pipe(
  params,
  constructViewModel(dependencies, pageSize),
  TE.bimap(renderErrorPage, renderAsHtml),
);
