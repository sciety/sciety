import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params, Dependencies, constructViewModel } from './construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageViewModel, constructErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage } from '../html-page';

export const scietyFeedPage = (
  dependencies: Dependencies,
) => (pageSize: number) => (params: Params): TE.TaskEither<ErrorPageViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies, pageSize),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
