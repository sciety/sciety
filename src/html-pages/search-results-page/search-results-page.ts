import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params } from './perform-all-searches';
import { renderAsHtml } from './render-as-html/render-as-html';
import { RenderPageError } from '../../types/render-page-error';
import { Page } from '../../types/page';
import { renderErrorPage } from './render-as-html/render-error-page';
import { Ports, constructViewModel } from './construct-view-model/construct-view-model';

type SearchResultsPage = (
  ports: Ports,
) => (pageSize: number) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const searchResultsPage: SearchResultsPage = (ports) => (pageSize) => (params) => pipe(
  params,
  constructViewModel(ports, pageSize),
  TE.bimap(renderErrorPage, renderAsHtml),
);
