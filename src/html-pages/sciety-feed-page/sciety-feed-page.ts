import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../html-page.js';
import { ErrorPageBodyViewModel } from '../../types/render-page-error.js';
import { renderErrorPage } from './render-as-html/render-error-page.js';
import { renderAsHtml } from './render-as-html/render-as-html.js';
import { Params, Dependencies, constructViewModel } from './construct-view-model/index.js';

export const scietyFeedPage = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies, pageSize),
  TE.bimap(renderErrorPage, renderAsHtml),
);
