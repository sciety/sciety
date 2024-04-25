import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params, Dependencies, constructViewModel } from './construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { renderErrorPage } from './render-as-html/render-error-page';
import { HtmlPage } from '../../../html-pages/html-page';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';

export const scietyFeedPage = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies, pageSize),
  TE.bimap(renderErrorPage, renderAsHtml),
);
