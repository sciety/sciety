import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies, constructViewModel } from './construct-view-model';
import { Params } from './construct-view-model/params';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageViewModel, constructErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage } from '../html-page';

type SearchResultsPage = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params) => TE.TaskEither<ErrorPageViewModel, HtmlPage>;

export const searchResultsPage: SearchResultsPage = (dependencies) => (pageSize) => (params) => pipe(
  params,
  constructViewModel(dependencies, pageSize),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
