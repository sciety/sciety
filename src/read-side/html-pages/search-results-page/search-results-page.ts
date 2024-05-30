import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies, constructViewModel } from './construct-view-model';
import { Params } from './construct-view-model/params';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { HtmlPage } from '../html-page';
import { renderErrorPage } from '../render-error-page';

type SearchResultsPage = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const searchResultsPage: SearchResultsPage = (dependencies) => (pageSize) => (params) => pipe(
  params,
  constructViewModel(dependencies, pageSize),
  TE.bimap(renderErrorPage, renderAsHtml),
);
