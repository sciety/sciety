import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params, Dependencies, constructViewModel } from './construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { HtmlPage } from '../html-page';
import { renderErrorPage } from '../render-error-page';

export const scietyFeedPage = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies, pageSize),
  TE.bimap(renderErrorPage, renderAsHtml),
);
